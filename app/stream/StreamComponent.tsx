"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function StreamComponent({ initialTrackData }) {
  useEffect(() => {
    if (window.Spotify) {
      const embed = document.getElementById("embed-iframe");
      window.Spotify.createController(
        embed,
        {
          width: "100%",
          height: "352",
          uri: `spotify:track:${initialTrackData.id}`,
        },
        {}
      );
    }
  }, [initialTrackData]);

  return (
    <div>
      <Script
        src="https://open.spotify.com/embed/iframe-api/v1"
        strategy="afterInteractive"
        onLoad={() => {
          window.onSpotifyIframeApiReady = (IFrameAPI) => {
            window.Spotify = IFrameAPI;
          };
        }}
      />
      <h1>{initialTrackData.name}</h1>
      <div id="embed-iframe"></div>
    </div>
  );
}
