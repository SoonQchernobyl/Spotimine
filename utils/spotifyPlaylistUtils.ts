import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("No access token");

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createPlaylist(trackIds: string[], playlistName: string) {
  console.log("Creating playlist:", playlistName);
  console.log("Track IDs:", trackIds);

  const { id: user_id } = await fetchWebApi("v1/me", "GET");
  console.log("User ID:", user_id);

  const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, "POST", {
    name: playlistName,
    description: "Playlist created based on audio features",
    public: false,
  });
  console.log("Created playlist:", playlist);

  if (playlist.id) {
    const addTracksResponse = await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks`,
      "POST",
      {
        uris: trackIds.map((id) => `spotify:track:${id}`),
      }
    );
    console.log("Added tracks response:", addTracksResponse);
  }

  return playlist;
}

export async function getTopTracksForFeature(
  feature: string,
  limit: number = 20,
  selectedTrackId: string
) {
  console.log(
    `Getting top tracks for feature: ${feature}, limit: ${limit}, selectedTrackId: ${selectedTrackId}`
  );

  // 선택된 트랙 정보 가져오기
  const selectedTrack = await fetchWebApi(
    `v1/tracks/${selectedTrackId}`,
    "GET"
  );
  console.log("Selected track:", selectedTrack);

  // API를 통해 DB에서 트랙 가져오기
  const response = await fetch(
    `/api/getTopTracks?feature=${feature}&limit=${limit}`
  );
  const dbTracks = await response.json();
  console.log("Tracks from DB:", dbTracks);

  // 최종 트랙 리스트 생성
  const finalTracks = [
    selectedTrack,
    ...dbTracks
      .filter((t) => t.spotifyId !== selectedTrackId)
      .map((t) => ({
        id: t.spotifyId,
        name: t.name,
        artists: [{ name: t.artist }],
        audio_features: t.audioFeatures,
      })),
  ].slice(0, limit);

  console.log("Final tracks list:", finalTracks);

  return finalTracks;
}
