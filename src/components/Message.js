import React from "react";
import "./Message.css";
export default function Message({type, userName, userImage, text, imageURL,createAt,mymsj }) {
  return (
 <>
 {mymsj?    <div className="direct-chat-msg">
      
      <div className="direct-chat-info right">
      {type==="image/jpeg"? <img src={imageURL} width="150" className="direct-chat-text-right right" alt="uploadimage"/> :<div className="direct-chat-text-right">{text}</div> }
        {/* <span className="direct-chat-name" style={{color:"white"}}>{userName}</span> */}
        <img
        className="direct-chat-img right"
        src={userImage}
        alt="message-user"
      />
      </div>
     
         
         <p className="direct-chat-timestamp right">{new Date(createAt.toDate()).toUTCString()}</p>{" "}
    </div> :  <div className="direct-chat-msg">
      <div className="direct-chat-info">
        <span className="direct-chat-name" style={{color:"white"}}>{userName}</span>
       
      </div>
      <img
        className="direct-chat-img"
        src={userImage}
        alt="message user image"
      />
         {type==="image/jpeg"? <img src={imageURL} width="150" className="direct-chat-text"/> :<div className="direct-chat-text">{text}</div> }
         <p className="direct-chat-timestamp">{new Date(createAt.toDate()).toUTCString()}</p>{" "}
    </div> }
 </>
  /*   */
    /*  <div style={{display:"flex"}}>
      <div>
        <img src={userImage} alt="" width="50" style={{borderRadius:"50%"}} />
        <p>{userName}</p>
      </div>
      <div>
        {text ?<h4>{text }</h4> : <img src={imageURL} width="200" alt="" /> }
        
      </div>
    </div> */
  );
}
