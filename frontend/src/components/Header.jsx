import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import Logo from "./Logo";
import useMyProfile from "../hooks/useMyProfile";
import useUserProfile from "../hooks/useUserProfile";

const navLinks = [
  { title: "Home", link: "/" },
  { title: "Challenges", link: "/challenges" },
];

function AvatarButton({ image, name, email }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || email || "?")[0]?.toUpperCase();

  useEffect(() => {
    setImgError(false);
  }, [image]);

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt=""
        className="w-8 h-8 rounded-full border border-zinc-200 object-cover cursor-pointer"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center border border-zinc-200 cursor-pointer">
      {initials}
    </span>
  );
}

function UserMenu({ user, avatarImage, myProfile, signOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const profileHref = myProfile?.username ? `/u/${myProfile.username}` : null;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
  };

  const handleProfile = async () => {
    setOpen(false);
    if (profileHref) await navigate(profileHref);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center focus:outline-none"
        aria-label="Account menu"
      >
        <AvatarButton image={avatarImage} name={user.name} email={user.email} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-zinc-100 py-1 z-50">
          {profileHref && (
            <button
              onClick={handleProfile}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition"
            >
              <FiUser size={14} />
              Profile
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition"
          >
            <FiLogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function Header() {
  const { user, signOut, loading } = useAuth();
  const { data: myProfile } = useMyProfile();
  const { data: publicProfile } = useUserProfile(myProfile?.username ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const profileHref = myProfile?.username ? `/u/${myProfile.username}` : null;
  const avatarImage = myProfile?.image ?? publicProfile?.image ?? user?.image ?? null;

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
                `text-lg transition hover:text-blue-500 ${isActive ? "text-blue-500" : ""}`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            user ? (
              <UserMenu user={user} avatarImage={avatarImage} myProfile={myProfile} signOut={signOut} />
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium text-zinc-700 border border-zinc-300 px-4 py-2 rounded-lg hover:bg-zinc-100 transition"
                >
                  Sign in
                </button>
                <Link
                  to="/challenges"
                  className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  Start practicing
                </Link>
              </>
            )
          )}
        </div>

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
        onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 z-50 transition-all duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <Logo />
          <button onClick={() => setIsOpen(false)} className="text-3xl text-zinc-700">
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
                  isActive ? "bg-blue-100 text-blue-600" : "text-zinc-700 hover:bg-zinc-100"
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
          {user && profileHref && (
            <NavLink
              to={profileHref}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-lg transition ${
                  isActive ? "bg-blue-100 text-blue-600" : "text-zinc-700 hover:bg-zinc-100"
                }`
              }
            >
              My Profile
            </NavLink>
          )}
        </nav>

        {!loading && (
          <div className="border-t border-zinc-200 p-6 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <AvatarButton
                    image={avatarImage}
                    name={user.name}
                    email={user.email}
                  />
                  <p className="text-sm text-zinc-600 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="w-full text-sm font-medium border border-zinc-300 py-2 rounded-lg hover:bg-zinc-100 transition flex items-center justify-center gap-2"
                >
                  <FiLogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsOpen(false);
                }}
                className="w-full text-sm font-medium bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign in / Sign up
              </button>
            )}
          </div>
        )}
      </aside>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

export default Header;
