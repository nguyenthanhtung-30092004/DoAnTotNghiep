import React from "react";
import { Outlet } from "react-router";
import Header from "../Headers/Header";
import MiniCartDrawer from "../Cart/MiniCartDrawer";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <MiniCartDrawer />
      <footer></footer>
    </>
  );
};

export default Layout;
