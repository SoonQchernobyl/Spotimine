"use client";

import { signIn } from "next-auth/react";
import { Heading } from "../../ui/text";

function SpotifyLoginButton() {
  const handleSpotifyLogin = () => {
    signIn("spotify", { callbackUrl: "/top5" });
  };

  return (
    <div>
      <a onClick={handleSpotifyLogin}>
        <Heading
          style={{
            width: "150px",
            height: "23px",
            left: "140px",
            top: "608px",
            fontSize: "16px",
            lineHeight: "22px",
            color: "black",
          }}
        >
          Login with Spotify
        </Heading>
      </a>
    </div>
  );
}

export default SpotifyLoginButton;