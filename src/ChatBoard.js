import React, { useContext, useEffect, useRef, useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import {
  collection,
  addDoc,
  getDocs,setDoc,
  getFirestore,
  onSnapshot,
  Timestamp,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage";
import { MyContext } from "./context/MyConext";
import Messages from "./Messages";
import "./ChatBoard.css";
import app from "./firebaseAuthentication/firebaseConfig";

export default function ChatBoard() {
  const { messages, setMessages, user ,setUser} = useContext(MyContext);
  const [emoji, setEmoji] = useState(false);
  const boxRef= useRef()
  const inp = useRef();
  const db = getFirestore(app);
  const storage = getStorage();

  useEffect(() => {
    const getdata = async () => {
      const docRef = collection(db, "messages");
      const q = query(docRef, orderBy("createAt"));
      const docSnap = await getDocs(q);
      if (!docSnap.empty) {
        const msjs = docSnap.docs.map((doc) => {
          return doc.data();
        });
        setMessages(msjs);
      }
    };
    getdata();
    const docRef = collection(db, "messages");
    const q = query(docRef, orderBy("createAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msjs = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessages(msjs);
    });


    // Stop listening to changes
    return unsubscribe;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("woring");
    let message = {
      uid: user.uid,
      text: e.target.message.value,
      userName: user.displayName,
      userImage: user.photoURL,
      createAt: Timestamp.now(),
      type:"text/plain"
    };
    /*   const sent = await setDoc(doc(db,"messages"),message) */
    // Add a new document with a generated id.
    const sent = await addDoc(collection(db, "messages"), message);
    await setDoc(doc(db, `users`,user.uid), {...user,messages:[...user.messages,{...message,id:sent.id}]});
    const updatedUser= await getDoc(doc(db,"users",user.uid))
    setUser(updatedUser.data())
    console.log(message);
    e.target.reset();
    boxRef.current.scrollIntoView({behavior: "smooth"})
  };

  const uploadImage = (e) => {
    const storageRef = ref(storage, "images");
    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadFile = uploadBytesResumable(
      storageRef,
      e.target.files[0],
      metadata
    );

    uploadFile.on(
      "state.changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error.message);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadFile.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          let message = {
            userName: user.displayName,
            userImage: user.photoURL,
            createAt: Timestamp.now(),
            type: "image/jpeg",
            imageURL: downloadURL,
            uid:user.uid
          };
          const sent = await addDoc(collection(db, "messages"), message);
          await setDoc(doc(db, `users`,user.uid), {...user,uploads:[...user.uploads,{...message,id:sent.id}]});
          const updatedUser= await getDoc(doc(db,"users",user.uid))
           setUser(updatedUser.data())
        });
      }
    );
  };

  return (
    <div className="main">
      <div className="chatpanel">
        <div className="messagebox" style={{ color: "white" }}>
          <Messages />
          <span ref={boxRef}></span>
        </div>
        <div className="user-online" style={{ color: "white" }}>
          users list
        </div>
      </div>

      <form onSubmit={sendMessage}>
        <input type="text" name="message" ref={inp} />
        <div className="emoji-holder">
          <span onClick={() => setEmoji(!emoji)}> &#x1F61D;</span>

          <label>
            <span>
              &#x1F4C2;
              <input
                type="file"
                onChange={uploadImage}
                style={{ display: "none" }}
              />{" "}
            </span>
          </label>
          {emoji && (
            <Picker
              showPreview={true}
              onClick={(emoji) => {
                inp.current.value += emoji.native;
                inp.current.focus();
              }}
              style={{ position: "absolute", bottom: "35px", left: "20px" }}
            />
          )}
        </div>
        <input type="submit" value="send" />
      </form>
    </div>
  );
}
