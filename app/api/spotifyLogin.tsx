"use client";

import { Heading } from "../../ui/text";
import { redirectUri } from "../top5/top5";

function SpotifyLoginButton() {
  const handleSpotifyLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent("http://localhost:8080/callback");
    const scopes = encodeURIComponent("user-read-private user-read-email"); // 필요한 권한
    const spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
    window.location.href = spotifyUrl;
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
