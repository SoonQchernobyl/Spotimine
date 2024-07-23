import React from "react";
import Button from "../ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div
        style={{
          width: "428px",
          height: "926px",
          backgroundColor: "#121212",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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

        <Button type="green" style={{ top: "605px" }}>
          {/* <Link>
          
          </Link> */}
        </Button>
        <Button type="default" style={{ top: "666px" }}></Button>
      </div>
    </main>
  );
}
