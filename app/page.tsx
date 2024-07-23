import React from "react";
import Button from "../ui/Button";
import { Heading } from "../ui/text";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>
        {/* <h1
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
        </h1> */}
        <Heading
          style={{
            position: "absolute",
            width: "246px",
            height: "84px",
            left: "91px",
            top: "499px",
          }}
        >
          Millions of Songs. Free on Spotify.
        </Heading>

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
          </Link>  링크 들어갈 곳*/}
        </Button>
        <Button type="default" style={{ top: "666px" }}>
          <Heading>Continue with Google</Heading>
        </Button>
        <Button type="default" style={{ top: "727px" }}>
          <Heading></Heading>
        </Button>
        <Button type="default" style={{ top: "788px" }}>
          <Heading></Heading>
        </Button>
      </div>
    </main>
  );
}

// /* Continue with Google */

// position: absolute;
// width: 171px;
// height: 23px;
// left: 129px;
// top: 679px;

// font-family: 'Avenir Next';
// font-style: normal;
// font-weight: 700;
// font-size: 16px;
// line-height: 22px;

// color: #F5F5F5;
