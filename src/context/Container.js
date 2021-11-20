import React, { useState } from "react";
import { MyContext } from "./MyConext";

export default function Container({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [register, setRegister] = useState(false);

  return (
    <MyContext.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        onlineUsers,
        setOnlineUsers,
        messages,
        setMessages,
        register, setRegister
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
