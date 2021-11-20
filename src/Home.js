
import React, { useContext, useEffect } from 'react';
import Login from "./Login"
import ChatBoard from "./ChatBoard"
import { MyContext } from './context/MyConext';
import {onAuthStateChanged, getAuth} from "firebase/auth"

const auth = getAuth()

function Home() {

  const {user,setUser} = useContext(MyContext)

   useEffect(()=>{
     let local = JSON.parse(localStorage.getItem("user"))
     if(local){
       setUser(local)
     }
  },[]) 


  return (
    <div className="home">
      {user ? <ChatBoard/> : <Login auth={auth}/>}
    </div>
  );
}

export default Home;