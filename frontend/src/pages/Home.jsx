import React from "react";
import { Link } from "react-router";

function Home() {
  return (
    <div>
      <h1>This is the home page (trust me!)</h1>

      <Link to="/challenges">Go to Challenges</Link>
    </div>
  );
}

export default Home;
