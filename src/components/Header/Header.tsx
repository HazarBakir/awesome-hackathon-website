import "./Header.css";
import React from "react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  return (
    <header className="header">
      <a href="/">
        <>
          <img className="header__logo" />
          <span
            className={
              `header__title` +
              (isLandingPage ? " header__title--landing-white" : "")
            }
          >
            Papyr.io
          </span>
        </>
      </a>
    </header>
  );
};

export default Header;
