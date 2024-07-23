import React from "react";
import Button from "../ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>
        <h1
          style={{
            position: "absolute",
            width: "246px",
            height: "84px",
            left: "91px",
            top: "499px",
            fontFamily: "Avenir Next",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "28px",
            lineHeight: "38px",
            textAlign: "center",
            color: "#FFFFFF",
          }}
        >
          Millions of Songs. Free on Spotify.
        </h1>
        <Image
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
        />

        <Button type="green" style={{ top: "605px" }}>
          {/* <Link>
          
          </Link> */}
        </Button>
        <Button type="default" style={{ top: "666px" }}></Button>
      </div>
    </main>
  );
}
