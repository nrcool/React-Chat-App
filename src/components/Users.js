import React, { useContext, useEffect } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import "./Users.css"
import { MyContext } from "../context/MyConext";
const db = getFirestore();

export default function Users() {
  const { users, setUsers,setOnlineUsers,onlineUsers } = useContext(MyContext);

  useEffect(() => {
    const docRef = collection(db, "users");
    const q = query(docRef, orderBy("online"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        return doc.data();
      });

      let onlineU=users.filter(user=>user.online)
      let offlineU=users.filter(user=>!user.online)
      console.log(onlineU.length, onlineUsers.length)
    /*   if(onlineU.length<=onlineUsers.length){
        toast('user offline!', {
          icon:"😞",
        });
      }
      if(offlineU.length<users.length){
          toast('new user online!', {
            icon:"😃",
          });
      } */
      setUsers(offlineU);
      setOnlineUsers(onlineU)
    });
    return unsubscribe;
  }, []);

  return <div className="allusers">
      <h4>Online Users</h4>
      <div className="online-users">
          {onlineUsers.map(user=>{
      return(
          <div className="online-user">
          <img src={user.photoURL}  className="online-user-image" alt="" />
          <p>{user.displayName}</p>
          </div>
      )
  })
  
  }
      </div>
      <h4>Offline Users</h4>
      <div className="offline-users">
          {users.map(user=>{
              return(
                  <div className="offline-user">
                      <img src={user.photoURL} className="offline-user-image"  alt="" />
                         <p>{user.displayName}</p> 
                      </div>
             
              )
          })}
      </div>
      </div>;
}
