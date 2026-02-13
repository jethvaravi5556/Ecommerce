import React from 'react';
import logo from '../assest/logo.png'; // adjust if you rename to 'assets'

const Logo = ({ w = 700, h = 50 }) => {
  return (
    <img
      src={logo}
      alt="App Logo"
      width={w}
      height={h}
      className="object-contain"
    />
  );
};

export default Logo;
