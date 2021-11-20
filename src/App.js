
import React from "react";
import "./App.css"
import fire from "./firebaseAuthentication/firebaseConfig"
import Header from "./Header";
import { HashRouter, Routes, Route } from "react-router-dom";
import User from "./User"
import Home from "./Home";
import Contact from "./Contact";
import ChatBoard from "./ChatBoard";
import Container from "./context/Container";

function App() {
  return (
    
    <HashRouter>
      <Container>
      <div className="app">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<User/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/chatboard" element={<ChatBoard/>}/>
        </Routes>
      </div>        
      </Container>
      </HashRouter>
  );
}

export default App;