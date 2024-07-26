"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div>
      <h1>Sign in to your account</h1>
      <button onClick={() => signIn("spotify", { callbackUrl })}>
        Sign in with Spotify
      </button>
    </div>
  );
}
