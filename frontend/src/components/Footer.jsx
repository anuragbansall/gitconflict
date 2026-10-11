import React from "react";
import InputButton from "./InputButton";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  const socialLinks = [
    {
      name: "Twitter",
      url: "https://twitter.com/",
      icons: <FaXTwitter />,
      hoverColor: "hover:text-gray-900",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/",
      icons: <FaLinkedin />,
      hoverColor: "hover:text-blue-700",
    },
    {
      name: "GitHub",
      url: "https://github.com/",
      icons: <FaGithub />,
      hoverColor: "hover:text-gray-800",
    },
  ];

  return (
    <footer className="my-12">
      <div className="p-12 rounded-xl bg-gray-100/30 shadow-[0_0px_10px_rgba(0,0,0,0.05)] max-w-300 mx-auto">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl font-semibold text-zinc-800">
            Stay in the loop
          </h2>
          <p className="text-center text-zinc-500 text-lg mt-4 max-w-120">
            Subscribe to our newsletter to get the latest updates and offers.
          </p>

          <InputButton
            placeholder="Enter your email"
            className="mt-6 border-zinc-300"
            buttonText="Subscribe"
            type="email"
            onSubmit={(e) => {
              e.preventDefault();
              e.target.reset();
            }}
          />
        </div>

        <div className="flex items-center gap-6 text-zinc-500 mx-auto w-fit mt-12 text-3xl">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:transition-colors duration-300 ${link.hoverColor}`}
            >
              {link.icons}
            </a>
          ))}
        </div>
      </div>

      <p className="text-center text-zinc-500 text-sm md:text-lg my-8">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold">gitconflict</span>. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
