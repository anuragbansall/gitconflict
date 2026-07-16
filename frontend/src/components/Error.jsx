import React from "react";

function Error({ error }) {
  return (
    <div className="text-center text-red-500">
      Error occurred while fetching challenge: {error.message}
    </div>
  );
}

export default Error;
