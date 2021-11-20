
import React, { useContext, useEffect } from 'react';
import { MyContext } from './context/MyConext';
import Message from './Message';


function Messages() {


  const {messages,setMessages,user}=useContext(MyContext)
  return (
    <div className="messages">
      {messages.map(msj=>{
        return(
          <Message userName={msj.userName} userImage={msj.userImage} text={msj.text} imageURL={msj.imageURL} createAt={msj.createAt} mymsj={msj.uid===user.uid} type={msj.type}/>
        )
      })}
    </div>
  );
}

export default Messages;