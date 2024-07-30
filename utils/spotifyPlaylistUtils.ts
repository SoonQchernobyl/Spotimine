import { getSession } from "next-auth/react";

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
  limit: number = 20
) {
  const response = await fetchWebApi("v1/me/top/tracks?limit=50", "GET");
  const tracks = response.items;

  const audioFeatures = await fetchWebApi(
    `v1/audio-features?ids=${tracks.map((t) => t.id).join(",")}`,
    "GET"
  );

  const tracksWithFeatures = tracks.map((track, index) => ({
    ...track,
    audio_features: audioFeatures.audio_features[index],
  }));

  return tracksWithFeatures
    .sort((a, b) => b.audio_features[feature] - a.audio_features[feature])
    .slice(0, limit);
}
