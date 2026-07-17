import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";

import Button from "./Button";
import Logo from "./Logo";

const navLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Challenges",
    link: "/challenges",
  },
];

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="w-full max-w-300 rounded-xl shadow-[0_8px_10px_rgba(0,0,0,0.25)] shadow-zinc-100 mx-auto py-5 px-6 flex items-center justify-between sticky top-6 bg-zinc-50/80 backdrop-blur-md z-50">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-zinc-700 font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.link}
              to={link.link}
              className={({ isActive }) =>
                `text-lg transition hover:text-blue-500 ${
                  isActive ? "text-blue-500" : ""
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/challenges"
            className="text-md font-medium bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            Start practicing
          </Link>
        </div>

        {/* Desktop Buttons */}
        {/* <div className="hidden md:flex items-center gap-4">
          {isOpen ? (
            <>
              <Button isPrimary={false} onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button isPrimary onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          ) : (
            <Button isPrimary onClick={() => navigate("/logout")}>
              Logout
            </Button>
          )}
        </div> */}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-3xl text-zinc-700"
        >
          <HiOutlineMenuAlt3 />
        </button>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 z-50 transition-all duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <Logo />

          <button
            onClick={() => setIsOpen(false)}
            className="text-3xl text-zinc-700"
          >
            <HiOutlineX />
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.link}
              to={link.link}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        {/* <div className="border-t border-zinc-200 p-6 flex flex-col gap-3">
          {isOpen ? (
            <>
              <Button
                isPrimary={false}
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
              >
                Login
              </Button>

              <Button
                isPrimary
                onClick={() => {
                  navigate("/register");
                  setIsOpen(false);
                }}
              >
                Register
              </Button>
            </>
          ) : (
            <Button
              isPrimary
              onClick={() => {
                navigate("/logout");
                setIsOpen(false);
              }}
            >
              Logout
            </Button>
          )}
        </div> */}
      </aside>
    </>
  );
}

export default Header;
