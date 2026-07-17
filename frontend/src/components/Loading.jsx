import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Loading({ message = "Loading..." }) {
  return (
    <main className="w-full h-full max-w-300 mx-auto flex items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg animate-pulse" />
          <AiOutlineLoading3Quarters className="relative text-5xl text-blue-600 animate-spin" />
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-lg font-semibold text-zinc-700">{message}</p>
          <div className="mt-3 flex justify-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
            <span
              className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Loading;
