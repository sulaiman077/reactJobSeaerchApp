import React from 'react';
import './Header.css';
import logo from '../assets/logo.png'; // Ensure this path is correct for your logo

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Careers@Gov Logo" className="logo" />
      </div>
      <nav className="nav">
        <a href="#">Singapore Public Service</a>
        <a href="#">Explore Careers</a>
      </nav>
      <div className="login-container">
        <button className="login-button">Login</button>
      </div>
    </header>
  );
};

export default Header;
