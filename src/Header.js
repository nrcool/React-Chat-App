import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { MyContext } from "./context/MyConext";
import "./header.css"


export default function Header() {
  const {user}=useContext(MyContext)
  return (
    <nav style={{zIndex:9}}>
      <ul>
        {user ?  <><li>
          <NavLink to="/profile">
         {/*  <img src={user.photoURL} width="30" style={{borderRadius:"50%",display:"inline"}} alt="" /> */} Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
           MainChat
          </NavLink>
        </li>
        </>
        
      : 
        <li>
          <NavLink to="/">
              Login
          </NavLink>

        </li>
      }
      <li>
        <NavLink to="/contact">
          Contact
        </NavLink>
      </li>
       
      </ul>
    </nav>
  );
}
