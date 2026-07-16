import React from "react";

function Loading({ message = "Loading..." }) {
  return (
    <main className="w-full h-full max-w-300 mx-auto flex items-center justify-center px-4 py-8">
      <div className="text-lg font-medium text-zinc-600">{message}</div>
    </main>
  );
}

export default Loading;
