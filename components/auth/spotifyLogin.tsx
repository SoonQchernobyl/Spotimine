"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heading } from "../ui/Text";
import { fetchAndSaveTracks } from "../../utils/spotifyApi";
import { useEffect } from "react";

function SpotifyLoginButton() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn("spotify"); // Force sign in to hopefully resolve error
    }
  }, [session]);

  const handleSpotifyLogin = async () => {
    if (status === "unauthenticated") {
      await signIn("spotify", { callbackUrl: "/topSongs" });
    } else if (status === "authenticated" && session?.accessToken) {
      try {
        console.log("fetchAndSaveTracks 호출 전");
        await fetchAndSaveTracks();
        console.log("fetchAndSaveTracks 호출 후");
        router.push("/topSongs");
      } catch (error) {
        console.error("트랙 데이터 가져오기 실패:", error);
        if (error.message.includes("The access token expired")) {
          await update(); // Force session update to get a new access token
          handleSpotifyLogin(); // Retry after updating the session
        }
      }
    }
  };

  return (
    <div onClick={handleSpotifyLogin}>
      <Heading
        style={{
          width: "150px",
          height: "23px",
          left: "140px",
          top: "618px",
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
