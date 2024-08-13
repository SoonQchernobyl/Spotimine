// StreamComponent.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./stream.module.css";
import {
  getTopTracksForFeature,
  createTemporaryPlaylist,
  savePlaylistToSpotify,
} from "../../utils/spotifyPlaylistUtils";

const validFeatures = ["tempo", "speechiness", "valence", "acousticness"];

export default function StreamComponent({
  initialTrackData,
  trackId,
  selectedFeature = "tempo",
}) {
  const [playlistId, setPlaylistId] = useState(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const createSpotifyPlaylist = useCallback(async () => {
    setIsCreatingPlaylist(true);
    setError(null);
    try {
      if (!validFeatures.includes(selectedFeature)) {
        throw new Error(`Invalid feature: ${selectedFeature}`);
      }

      const topTrackIds = await getTopTracksForFeature(
        selectedFeature,
        20,
        trackId
      );

      const playlistName = `Top 20 ${
        selectedFeature.charAt(0).toUpperCase() + selectedFeature.slice(1)
      } Tracks`;

      const newPlaylist = await createTemporaryPlaylist(
        topTrackIds,
        playlistName
      );
      setPlaylistId(newPlaylist.id);
    } catch (error) {
      console.error("Error creating temporary playlist:", error);
      setError(error.message || "Failed to create temporary playlist");
    } finally {
      setIsCreatingPlaylist(false);
    }
  }, [selectedFeature, trackId]);

  useEffect(() => {
    createSpotifyPlaylist();
  }, [createSpotifyPlaylist, selectedFeature]); // selectedFeature 추가

  const handleSavePlaylist = async () => {
    try {
      if (!playlistId) throw new Error("No playlist to save");
      await savePlaylistToSpotify({ id: playlistId });
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving playlist:", error);
      setError(error.message || "Failed to save playlist");
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
        <p className={styles.loading}>Creating temporary playlist...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : playlistId ? (
        <div className={styles.playlistContainer}>
          <h2
            className={styles.playlistName}
          >{`Top 20 ${selectedFeature} Tracks`}</h2>
          <iframe
            title={`Spotify Embed: Top 20 ${selectedFeature} Tracks`}
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className={styles.spotifyEmbed}
          />
          {!isSaved && (
            <button onClick={handleSavePlaylist} className={styles.saveButton}>
              Save to Spotify
            </button>
          )}
          {isSaved && (
            <p className={styles.savedMessage}>Playlist saved to Spotify!</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
