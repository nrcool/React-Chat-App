import React, { useContext } from 'react'
import { MyContext } from './context/MyConext'
import {signOut,getAuth} from "firebase/auth"
import "./User.css"
import { useNavigate } from 'react-router-dom'
export default function User() {
    const {user,setUser}=useContext(MyContext)
    const auth = getAuth()
    const navigate= useNavigate()
    const LogOut=()=>{
        signOut(auth).then(()=>{
            navigate("/")
            setUser(null)
        })
    }
    return (
        <div className="container d-flex justify-content-center align-items-center">
        <div className="card1">
            <div className="upper"> <img src="https://i.imgur.com/Qtrsrk5.jpg" className="img-fluid"/> </div>
            <div className="user text-center">
                <div className="profile"> <img src={user.photoURL} className="rounded-circle" width="80"/> </div>
            </div>
            <div className="mt-5 text-center">
                <h4 className="mb-0">{user.displayName}</h4> <span className="text-muted d-block mb-2">{user.location}</span> <button className="btn btn-primary btn-sm follow">{user.email}</button>
                <div className="d-flex justify-content-between align-items-center mt-4 px-4">
                    <div className="stats">
                        <h6 className="mb-0">sent messages</h6> <span>812</span>
                    </div>
                    <div className="stats">
                        <h6 className="mb-0">uploaded files</h6> <span>12</span>
                    </div>
                    <div className="stats">
                        <button className="btn btn-primary" onClick={LogOut}>LogOut</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
