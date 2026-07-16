import React from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

function ChallengePopup({ success = false, errors = [], onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-xl border bg-white shadow-2xl ${
          success ? "border-green-500" : "border-red-500"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b px-6 py-4 ${
            success
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {success ? (
              <FaCheckCircle className="text-3xl text-green-600" />
            ) : (
              <FaTimesCircle className="text-3xl text-red-600" />
            )}

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {success ? "Challenge Passed 🎉" : "Challenge Failed"}
              </h2>

              <p className="text-sm text-gray-500">
                {success
                  ? "Congratulations! All tests passed successfully."
                  : "Fix the following issues before submitting again."}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-200 hover:text-black cursor-pointer"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <FaCheckCircle className="mx-auto mb-3 text-5xl text-green-600" />
              <h3 className="text-lg font-semibold text-green-700">
                Well Done!
              </h3>
              <p className="mt-1 text-sm text-green-600">
                Your solution passed all validation checks.
              </p>
            </div>
          ) : (
            <>
              <h3 className="mb-4 font-semibold text-gray-700">
                The following issues were found:
              </h3>

              <div className="space-y-3">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3"
                  >
                    <FaTimesCircle className="mt-1 text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className={`rounded-lg px-5 py-2 font-medium text-white transition ${
              success
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {success ? "Continue" : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChallengePopup;
