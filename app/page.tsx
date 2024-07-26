"use client";

import React from "react";
import Button from "../ui/Button";
import { Heading } from "../ui/text";
import SpotifyLoginButton from "./api/spotifyLogin";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchAndSaveTracks } from "../utils/spotifyApi";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        console.log("fetchAndSaveTracks 호출 전");
        await fetchAndSaveTracks();
        console.log("fetchAndSaveTracks 호출 후");
        router.push("/top5");
      } catch (error) {
        console.error("트랙 데이터 가져오기 실패:", error);
        // 에러 처리 로직 (예: 사용자에게 알림)
      }
    }
  };

  return (
    <main>
      <div>
        <Image
          src="/bg.svg"
          layout="fixed"
          width={428}
          height={465}
          alt="Background"
          style={{
            position: "absolute",
            left: 8,
            top: 15,
          }}
        ></Image>
        <button
          onClick={() => {
            console.log("로그인 버튼 클릭됨");
            handleLogin();
          }}
        >
          {" "}
          ㅁㄴㅇㅁㄴㅇ
        </button>

        <Heading
          style={{
            position: "absolute",
            width: "246px",
            height: "84px",
            left: "91px",
            top: "499px",
          }}
        >
          Find your perfect Song on Spotify.
        </Heading>

        {/* <Image
          src="/spotify_icon_white.svg"
          alt="Spotify Icon"
          layout="fixed"
          width={53}
          height={53}
          style={{
            position: "absolute",
            left: 188,
            top: 436,
          }}
        /> */}

        <Button type="green" style={{ top: "605px" }}></Button>
        <SpotifyLoginButton onLogin={handleLogin} />
        <Button type="default" style={{ top: "666px" }}></Button>
        <Image
          src="/google_icon.svg"
          alt="Spotify Icon"
          layout="fixed"
          width={18}
          height={18}
          style={{
            position: "absolute",
            left: "62px",
            top: "681px",
          }}
        />
        <Heading
          style={{
            width: "171px",
            height: "23px",
            left: "129px",
            top: "669px",
            fontSize: "16px",
            lineHeight: "22px",
          }}
        >
          Continue with Google
        </Heading>

        <Button type="default" style={{ top: "727px" }}></Button>
        <Image
          src="/facebook_icon.svg"
          alt="Spotify Icon"
          layout="fixed"
          width={18}
          height={18}
          style={{
            position: "absolute",
            left: "62px",
            top: "742px",
          }}
        />
        <Heading
          style={{
            width: "191px",
            height: "23px",
            left: "129px",
            top: "730px",
            fontSize: "16px",
            lineHeight: "22px",
          }}
        >
          Continue with Facebook
        </Heading>
        <Button type="default" style={{ top: "788px" }}></Button>
        <Image
          src="/apple_icon.svg"
          alt="Spotify Icon"
          layout="fixed"
          width={18}
          height={18}
          style={{
            position: "absolute",
            left: "62px",
            top: "803px",
          }}
        />
        <Heading
          style={{
            width: "171px",
            height: "23px",
            left: "127px",
            top: "791px",
            fontSize: "16px",
            lineHeight: "22px",
          }}
        >
          Continue with Apple
        </Heading>
      </div>
    </main>
  );
}
