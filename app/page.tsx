import React from "react";
import LoginButton from "../ui/loginButton";

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
        <LoginButton />
      </div>
    </main>
  );
}
