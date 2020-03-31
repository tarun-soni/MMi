import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function Nav() {
    
    const navStyle = {
        color: "#e2f1f8"
    };

  return (
    <nav>
      <Link style={navStyle} to='/'>
       <h4 className="btns"> MMI </h4>
          </Link>
      <ul className="nav-links">
          <Link style={navStyle} to='/Doctor'>
            <li className="btns">Doctor</li>
          </Link>
          <Link style={navStyle} to='/Patient'>
            <li className="btns">Patient</li>
          </Link>
          <Link style={navStyle} to='/Lab'>
            <li className="btns">Lab</li>
          </Link>
          </ul>
    </nav>
   
  );
}

export default Nav;
