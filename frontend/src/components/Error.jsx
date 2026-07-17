import React from "react";
import { BiErrorCircle } from "react-icons/bi";

function Error({ error }) {
  return (
    <main className="w-full h-full max-w-300 mx-auto flex items-center justify-center px-4 py-8">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4">
          <BiErrorCircle className="text-5xl text-red-500" />
        </div>

        <h2 className="text-xl font-semibold text-zinc-800">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-zinc-600">
          We couldn't load the requested data.
        </p>

        {error?.message && (
          <div className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="wrap-break-words font-mono text-sm text-red-600">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Error;
