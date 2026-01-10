import React from "react";
import NavBar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => (
  <div className="">
    <NavBar />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;