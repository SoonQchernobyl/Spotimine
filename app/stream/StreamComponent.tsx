"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import styles from "./styles.module.css";
import {
  createPlaylist,
  getTopTracksForFeature,
} from "../../utils/spotifyPlaylistUtils";

export default function StreamComponent({ initialTrackData, trackId }) {
  const embedRef = useRef<HTMLDivElement>(null);
  const [playlist, setPlaylist] = useState(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  useEffect(() => {
    let embedController: any = null;

    const initializeEmbed = () => {
      if (window.Spotify && embedRef.current) {
        window.Spotify.createController(
          embedRef.current,
          {
            width: "100%",
            height: "380", // 높이를 늘려 플레이리스트를 표시할 공간 확보
            uri: playlist
              ? `spotify:playlist:${playlist.id}`
              : `spotify:track:${trackId}`,
          },
          (controller: any) => {
            embedController = controller;
            console.log("Spotify Embed initialized");
          }
        );
      }
    };

    if (window.Spotify) {
      initializeEmbed();
    } else {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        window.Spotify = IFrameAPI;
        initializeEmbed();
      };
    }

    return () => {
      if (embedController) {
        embedController.destroy();
      }
    };
  }, [trackId, playlist]);

  const handleCreatePlaylist = async (feature: string) => {
    setIsCreatingPlaylist(true);
    try {
      const topTracks = await getTopTracksForFeature(feature);
      const newPlaylist = await createPlaylist(
        topTracks.map((t) => `spotify:track:${t.id}`),
        `Top ${feature.charAt(0).toUpperCase() + feature.slice(1)} Tracks`
      );
      setPlaylist(newPlaylist);
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  return (
    <div className={styles.container}>
      <Script
        src="https://open.spotify.com/embed/iframe-api/v1"
        strategy="afterInteractive"
      />
      <div className={styles.trackInfo}>
        <h1 className={styles.trackName}>{initialTrackData.name}</h1>
        <p className={styles.artistName}>
          {initialTrackData.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
      <div className={styles.playlistButtons}>
        <button
          onClick={() => handleCreatePlaylist("danceability")}
          disabled={isCreatingPlaylist}
        >
          Create Danceability Playlist
        </button>
        <button
          onClick={() => handleCreatePlaylist("energy")}
          disabled={isCreatingPlaylist}
        >
          Create Energy Playlist
        </button>
        <button
          onClick={() => handleCreatePlaylist("valence")}
          disabled={isCreatingPlaylist}
        >
          Create Valence Playlist
        </button>
        <button
          onClick={() => handleCreatePlaylist("acousticness")}
          disabled={isCreatingPlaylist}
        >
          Create Acousticness Playlist
        </button>
      </div>
      <div ref={embedRef} className={styles.spotifyEmbed}></div>
    </div>
  );
}
