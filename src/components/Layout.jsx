// src/components/Layout.jsx
import React from "react";
import "./Layout.css";
import Footer from "./Footer/Footer";
import Header from "./Header/index";
import HeroSection from "./HeroSection/HeroSection";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="content">
      <div className={`${isHomePage ? "overlayLayout" : ""}`}>
        <Header />
        {isHomePage && <HeroSection />}
      </div>
      <main className="mainBody">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
