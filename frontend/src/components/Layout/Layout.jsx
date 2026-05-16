import React from "react";
import { Outlet } from "react-router";
import Header from "../Headers/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};

export default Layout;
