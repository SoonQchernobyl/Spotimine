"use client";

import { signIn } from "next-auth/react";
import { Heading } from "../../ui/text";

interface SpotifyLoginButtonProps {
  onLogin?: () => void;
}

function SpotifyLoginButton({ onLogin }: SpotifyLoginButtonProps) {
  const handleSpotifyLogin = async () => {
    await signIn("spotify", { callbackUrl: "/top5" });
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div onClick={handleSpotifyLogin}>
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
    </div>
  );
}

export default SpotifyLoginButton;