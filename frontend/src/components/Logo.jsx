import React from "react";
import { Link } from "react-router";

function Logo({ className }) {
  return (
    <Link to="/" className={`text-2xl font-semibold group ${className}`}>
      <span className="text-blue-500 relative group-hover:text-blue-600 transition-all duration-300">
        git
        <div className="absolute left-0 right-0 h-0.5 bg-blue-500 bottom-0 w-0 group-hover:w-full transition-all duration-300"></div>
      </span>
      <span className="text-zinc-800 group-hover:text-zinc-900 transition-all duration-300">
        conflict
      </span>
    </Link>
  );
}

export default Logo;
