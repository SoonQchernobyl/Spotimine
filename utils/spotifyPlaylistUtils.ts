import { getSession } from "next-auth/react";

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("No access token");

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  return await res.json();
}

export async function createPlaylist(
  tracksUri: string[],
  playlistName: string
) {
  const { id: user_id } = await fetchWebApi("v1/me", "GET");
  const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, "POST", {
    name: playlistName,
    description: "Playlist created based on audio features",
    public: false,
  });
  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
    "POST"
  );
  return playlist;
}

export async function getTopTracksForFeature(
  feature: string,
  limit: number = 20
) {
  const response = await fetchWebApi(`v1/me/top/tracks?limit=50`, "GET");
  const tracks = response.items;

  // 오디오 특성 가져오기
  const audioFeatures = await fetchWebApi(
    `v1/audio-features?ids=${tracks.map((t) => t.id).join(",")}`,
    "GET"
  );

  // 트랙과 오디오 특성 결합
  const tracksWithFeatures = tracks.map((track, index) => ({
    ...track,
    audio_features: audioFeatures.audio_features[index],
  }));

  // 특정 특성으로 정렬 후 상위 20개 선택
  return tracksWithFeatures
    .sort((a, b) => b.audio_features[feature] - a.audio_features[feature])
    .slice(0, limit);
}
