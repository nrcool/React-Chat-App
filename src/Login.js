import React, { useContext, useState } from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
  Timestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { MyContext } from "./context/MyConext";
import image from "./images/chatapp.gif";
import google from "./images/google-plus.png";
import github from "./images/github.png";
import "./Login.css";
import {BsQuestionCircle ,BsHandThumbsUp} from "react-icons/bs"
import app from "./firebaseAuthentication/firebaseConfig";
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export default function Login({ auth }) {
  const [error, setError] = useState("");
  const { user, setUser, register, setRegister } = useContext(MyContext);
  const db = getFirestore(app)

 
  const LoginGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (credential) => {
       
        let {user}=credential
        const updatedUser= await getDoc(doc(db,"users",user.uid))
    
        if(updatedUser.data()){
          setUser(updatedUser.data())
          localStorage.setItem("user",JSON.stringify(updatedUser.data()) )
        }else{
           let newUser={
          displayName:user.displayName,
          email:user.email,
          uid:user.uid,
          photoURL:user.photoURL,
          online:1,
          messages:[],
          uploads:[]
        }
        const sent = await setDoc(doc(db, `users`,user.uid), newUser);
       
        setUser(newUser);
        localStorage.setItem("user",JSON.stringify(newUser) )
        }
       
      })
      .catch((err) => {
        console.log(err.message)
        setError(err.message);
      });
  };

  const LoginGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then(async (credential) => {
        let {user}=credential
        const updatedUser= await getDoc(doc(db,"users",user.uid))
        
        if(updatedUser.data()){
          setUser(updatedUser.data())
          localStorage.setItem("user",JSON.stringify(updatedUser.data()) )
        }else{
           let newUser={
          displayName:user.displayName,
          email:user.email,
          uid:user.uid,
          photoURL:user.photoURL,
          online:1,
          messages:[],
          uploads:[]
        }
        const sent = await setDoc(doc(db, `users`,user.uid), newUser);
       
        setUser(newUser);
        localStorage.setItem("user",JSON.stringify(newUser) )
        }
      })
      .catch((err) => setError(err.message));
  };
  const loginSubmit = (e) => {
    signInWithEmailAndPassword(auth,e.target.email.value,e.target.password.value)
    .then( async credential=>{
      const {user}= credential;

       const updatedUser= await getDoc(doc(db,"users",user.uid))
        
        if(updatedUser.data()){
          setUser(updatedUser.data())
          localStorage.setItem("user",JSON.stringify(updatedUser.data()) )
        }else{
           let newUser={
          displayName:user.displayName,
          email:user.email,
          uid:user.uid,
          photoURL:user.photoURL,
          online:1,
          messages:[],
          uploads:[]
        }
        const sent = await setDoc(doc(db, `users`,user.uid), newUser);
       
        setUser(newUser);
        localStorage.setItem("user",JSON.stringify(newUser) )
        }
      
      
      })
    
    .catch(err=>{
        console.log(err)
        e.target.reset() 
        setError(err.message)})
  };
  const registerSubmit = (e) => {
      e.preventDefault()
      createUserWithEmailAndPassword(auth,e.target.email.value,e.target.password.value)
      .then(async credential=>{
        let {user}=credential
        let newUser={
          displayName:user.displayName,
          email:user.email,
          uid:user.uid,
          photoURL:`https://joeschmoe.io/api/v1/${credential.user.displayName}`,
          online:1,
          messages:[],
          uploads:[]
        }
        const sent = await setDoc(doc(db, `users`,user.uid), newUser);
        window.localStorage.setItem("user",newUser)
          setUser(newUser)})
      .catch(err=>{
        console.log(err) 
        e.target.reset() 
        setError(err.message)})

    };
  return (
    <div className="login">
      <div className="image">
        <img src={image} alt="" />
      </div>
      <fieldset className="login-form">
        {/* <GoogleLoginButton onClick={LoginGoogle}/> */}

        <legend>{register ? "Login" : "Register"}</legend>
        <form onSubmit={register ? loginSubmit : registerSubmit}>
          <input type="email" placeholder="Email" name="email" />
          <br />
          <input type="password" placeholder="Password" name="password"/>
          <br />
          <button>{register ? "login" : "register"}</button>
        </form>
        <h2 className="login-error">{error}</h2>

        <div>
          <p onClick={() => setRegister(!register)}>
            {register ? (
              <>
                not yet registered <BsQuestionCircle />{" "}
              </>
            ) : (
              <>
                already registered <BsHandThumbsUp />
              </>
            )}
          </p>
        </div>
        <h3>OR</h3>
        <div className="login-icons">
          <img
            src={google}
            onClick={LoginGoogle}
            alt="G+"
            width="40"
            title="login with google-plus"
          />{" "}
          <img src={github} 
          onClick={LoginGithub}
          width="40" alt="github" title="login with Github" />
        </div>
      </fieldset>
    </div>
  );
}
