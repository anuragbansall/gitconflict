import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Challenges from "./pages/Challenges";
import PageLayout from "./components/PageLayout";
import BlankPageLayout from "./components/BlankPageLayout";
import Challenge from "./pages/Challenge";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/challenges" element={<Challenges />} />
        </Route>

        <Route element={<BlankPageLayout />}>
          <Route path="/challenges/:id" element={<Challenge />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
