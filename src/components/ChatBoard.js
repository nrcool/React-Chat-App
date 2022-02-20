import React, { useContext, useEffect, useRef, useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import toast ,{Toaster} from "react-hot-toast"
import Filter from "bad-words"
import naughtyWords from "naughty-words";

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
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage";
import { MyContext } from "../context/MyConext";
import Messages from "./Messages";
import Users from "./Users.js"
import "./ChatBoard.css";
import app from "../firebaseAuthentication/firebaseConfig";

export default function ChatBoard() {
  
  const filter = new Filter()
  let allwords=[]
  for(let key in naughtyWords){
    allwords.push(...naughtyWords[key])
  }
  filter.addWords(...allwords)
  const {setMessages, user ,setUser} = useContext(MyContext);
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
      boxRef.current.scrollIntoView({behavior: "smooth"})
    });


    // Stop listening to changes
    return unsubscribe;
  }, []);

 
  const sendMessage = async (e) => {
    e.preventDefault();
    if(e.target.message.value.length>2){
        e.target.message.value= filter.clean(e.target.message.value.toString())
    }
   
    if(e.target.message.value.trim()!==""){
    let message = {
      uid: user.uid,
      text: e.target.message.value,
      userName: user.displayName,
      userImage: user.photoURL,
      createAt: Timestamp.now(),
      type:"text/plain"
    };

    /*  const sent = await setDoc(doc(db,"messages"),message) */ 
    // Add a new document with a generated id.
    const sent = await addDoc(collection(db, "messages"), message);
    await setDoc(doc(db, `users`,user.uid), {...user,messages:[...user.messages,{...message,id:sent.id}]});
    const updatedUser= await getDoc(doc(db,"users",user.uid))
    localStorage.setItem("user",JSON.stringify(updatedUser.data()))
    setUser(updatedUser.data())
    console.log(message);
    e.target.reset();
    boxRef.current.scrollIntoView({behavior: "smooth"})
  };
}
  const uploadImage = (e) => {
    console.log(e.target.files[0])
    const storageRef = ref(storage, `images/${e.target.files[0].name}`);
    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadFile = uploadBytesResumable(
      storageRef,
      e.target.files[0],
      metadata
    );
    
    toast.promise(
      new Promise((resolve,reject)=>{
          resolve()
      }),
       {
         loading: 'sending file...',
         success: <b>Image sent!</b>,
         error: <b>Could not save.</b>,
       }
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
          default:
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
          localStorage.setItem("user",JSON.stringify(updatedUser.data())) 
          setUser(updatedUser.data())
           boxRef.current.scrollIntoView({behavior: "smooth"})
        });
      }
    );
  };

  return (
    <div className="main">
      <div><Toaster/></div>
      <div className="chatpanel">
        <div className="messagebox" style={{ color: "white" }}>
          <Messages />
          <span ref={boxRef}></span>
        </div>
        <div className="user-onlines" style={{ color: "white" }}>
          <Users/>
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
                setEmoji(!emoji)
              }}
              style={{ position: "absolute", bottom: "30px", left: "-340px" }}
            />
          )}
        </div>
        <label>
          <img src="https://icon-library.com/images/send-message-icon-png/send-message-icon-png-10.jpg" 
          width="45"
          alt="" />
          <input type="submit" style={{display:"none"}} />
        </label>
        
      </form>
    </div>
  );
}
