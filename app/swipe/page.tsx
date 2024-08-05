"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import SpotifyPlayer from "react-spotify-web-playback";
import { getTopTracksForFeature } from "../../utils/spotifyPlaylistUtils";
import { useSwipe } from "../../utils/SwipeContext";

const SwipePage = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { state, dispatch } = useSwipe();
  const feature = searchParams.get("feature") || state.feature;

  useEffect(() => {
    if (session?.accessToken && feature) {
      dispatch({ type: "SET_FEATURE", payload: feature });
      fetchTracks();
    }
  }, [session, feature]);

  const fetchTracks = async () => {
    try {
      const tracks = await getTopTracksForFeature(feature, 20);
      dispatch({ type: "SET_TRACKS", payload: tracks });
      if (tracks.length > 0) {
        dispatch({ type: "SET_CURRENT_TRACK", payload: tracks[0].id });
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const currentTrack = state.tracks.find(
    (track) => track.id === state.currentTrackId
  );

  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      <h1>Swipe Page</h1>
      <h2>Current Loop Station: {state.feature}</h2>
      {currentTrack && (
        <div>
          <h2>{currentTrack.name}</h2>
          <p>{currentTrack.artists.map((artist) => artist.name).join(", ")}</p>
          <p>
            {state.feature} value: {currentTrack.audio_features[state.feature]}
          </p>
          <p>
            Rank: {state.tracks.indexOf(currentTrack) + 1} /{" "}
            {state.tracks.length}
          </p>
          <img src={currentTrack.album.images[0].url} alt="Album artwork" />
          <SpotifyPlayer
            token={session.accessToken}
            uris={[`spotify:track:${currentTrack.id}`]}
            play={true}
          />
        </div>
      )}
    </div>
  );
};

export default SwipePage;
