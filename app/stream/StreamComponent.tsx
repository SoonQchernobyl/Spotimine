"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  getTopTracksForFeature,
  createPlaylist,
} from "../../utils/spotifyPlaylistUtils";

const validFeatures = ["tempo", "speechiness", "valence", "acousticness"];

export default function StreamComponent({
  initialTrackData,
  trackId,
  selectedFeature = "tempo",
}) {
  const [playlist, setPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createSpotifyPlaylist();
  }, [selectedFeature, trackId]);

  const createSpotifyPlaylist = async () => {
    setIsCreatingPlaylist(true);
    setError(null);
    try {
      if (!validFeatures.includes(selectedFeature)) {
        throw new Error(`Invalid feature: ${selectedFeature}`);
      }

      const topTracks = await getTopTracksForFeature(
        selectedFeature,
        20,
        trackId
      );
      setPlaylistTracks(topTracks);

      const playlistName = `Top 20 ${
        selectedFeature.charAt(0).toUpperCase() + selectedFeature.slice(1)
      } Tracks`;
      const newPlaylist = await createPlaylist(
        topTracks.map((t) => t.id),
        playlistName
      );
      setPlaylist(newPlaylist);
    } catch (error) {
      console.error("Error creating Spotify playlist:", error);
      setError(error.message || "Failed to create Spotify playlist");
    } finally {
      setIsCreatingPlaylist(false);
    }
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
        <p>Creating Spotify playlist...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : playlist ? (
        <div>
          <h2>{playlist.name}</h2>
          <ul className={styles.trackList}>
            {playlistTracks.map((track, index) => (
              <li key={track.id}>
                {index + 1}. {track.name} - {track.artists[0].name}
              </li>
            ))}
          </ul>
          <iframe
            title={`Spotify Embed: ${playlist.name}`}
            src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`}
            width="100%"
            height="380"
            style={{ minHeight: "360px" }}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      ) : null}
    </div>
  );
}
