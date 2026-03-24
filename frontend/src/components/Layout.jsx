import React from "react";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <header>header</header>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </>
  );
};

export default Layout;
