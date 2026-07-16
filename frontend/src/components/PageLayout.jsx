import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function PageLayout() {
  return (
    <main className="w-full relative bg-white min-h-screen">
      <Header />
      <section className="w-full px-6 py-8 my-6">
        <Outlet />
      </section>
      <Footer />
    </main>
  );
}

export default PageLayout;
