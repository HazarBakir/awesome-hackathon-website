import "./Header.css";

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="header">
      <a href="/">
        <img src="/papyr-logo.png" alt="Papyr Logo" className="header__logo" />
        <span className="header__title">Papyr.io</span>
      </a>
    </header>
  );
};

export default Header;
