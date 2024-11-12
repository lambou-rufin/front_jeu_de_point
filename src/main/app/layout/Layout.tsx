import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import Header from "./Header";
import Footer from "./Footer";
import { LayoutProps } from "../../../shared/models/interface";

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="layout">
      {/* <header className="header"> */}
      <Header />
      <main className="main">
        <Outlet /> {/* Rend les composants des routes imbriquées */}
      </main>
      {/* <footer className="footer"> */}
      <Footer />
    </div>
  );
};

export default Layout;
