"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import {
  createPlaylist,
  getTopTracksForFeature,
} from "../../utils/spotifyPlaylistUtils";

const validFeatures = ["tempo", "speechiness", "valence", "acousticness"];

export default function StreamComponent({
  initialTrackData,
  trackId,
  selectedFeature = "tempo",
}) {
  const embedRef = useRef<HTMLDivElement>(null);
  const [tempPlaylist, setTempPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmbedReady, setIsEmbedReady] = useState(false);
  const [spotifyController, setSpotifyController] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Spotify) {
        setIsEmbedReady(true);
      } else {
        window.onSpotifyIframeApiReady = () => {
          setIsEmbedReady(true);
        };
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isEmbedReady && embedRef.current && window.Spotify) {
      const initializeEmbed = () => {
        window.Spotify.createController(
          embedRef.current,
          {
            width: "100%",
            height: "380",
            uri: tempPlaylist
              ? `spotify:playlist:${tempPlaylist.id}`
              : `spotify:track:${trackId}`,
          },
          (controller) => {
            setSpotifyController(controller);
            console.log("Spotify Embed initialized");
          }
        );
      };

      initializeEmbed();
    }
  }, [isEmbedReady, trackId, tempPlaylist]);

  useEffect(() => {
    if (isEmbedReady) {
      createTempPlaylist();
    }
  }, [isEmbedReady, selectedFeature]);

  const createTempPlaylist = async () => {
    setIsCreatingPlaylist(true);
    setError(null);
    try {
      if (!validFeatures.includes(selectedFeature)) {
        throw new Error(`Invalid feature: ${selectedFeature}`);
      }

      const topTracks = await getTopTracksForFeature(selectedFeature, 10);
      const newPlaylist = await createPlaylist(
        topTracks.map((t) => t.id),
        `Top ${
          selectedFeature.charAt(0).toUpperCase() + selectedFeature.slice(1)
        } Tracks (Temporary)`
      );
      setTempPlaylist(newPlaylist);
      setPlaylistTracks(topTracks);

      if (spotifyController) {
        spotifyController.loadUri(`spotify:playlist:${newPlaylist.id}`);
      }
    } catch (error) {
      console.error("Error creating temporary playlist:", error);
      setError(error.message || "Failed to create temporary playlist");
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleAddToSpotify = async () => {
    console.log("Adding playlist to Spotify:", tempPlaylist.id);
    // Implement the logic to save the playlist to the user's Spotify account
  };

  return (
    <div className={styles.container}>
      <div className={styles.trackInfo}>
        <h1 className={styles.trackName}>{initialTrackData.name}</h1>
        <p className={styles.artistName}>
          {initialTrackData.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
      {isCreatingPlaylist ? (
        <p>Creating temporary playlist...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : tempPlaylist ? (
        <div>
          <h2>Temporary Playlist: {tempPlaylist.name}</h2>
          <button onClick={handleAddToSpotify}>Add to My Spotify</button>
          <ul className={styles.trackList}>
            {playlistTracks.map((track, index) => (
              <li key={track.id}>
                {index + 1}. {track.name} - {track.artists[0].name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div ref={embedRef} className={styles.spotifyEmbed}></div>
    </div>
  );
}
