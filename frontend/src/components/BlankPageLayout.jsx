import React from "react";
import { Outlet } from "react-router";

function BlankPageLayout() {
  return (
    <main className="w-full relative bg-white min-h-screen">
      <Outlet />
    </main>
  );
}

export default BlankPageLayout;
