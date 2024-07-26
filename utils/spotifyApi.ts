import { getSession } from "next-auth/react";

async function fetchAudioFeatures(trackIds: string[], accessToken: string) {
  const batchSize = 100;
  let allAudioFeatures = [];

  for (let i = 0; i < trackIds.length; i += batchSize) {
    const batch = trackIds.slice(i, i + batchSize);
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${batch.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `오디오 특성 가져오기 실패. 상태 코드: ${response.status}, 에러: ${errorText}`
      );
      throw new Error(
        `오디오 특성을 가져오는 데 실패했습니다. 상태 코드: ${response.status}`
      );
    }

    const data = await response.json();
    allAudioFeatures = [...allAudioFeatures, ...(data.audio_features || [])];
  }

  return allAudioFeatures;
}

export async function fetchAndSaveTracks() {
  console.log("fetchAndSaveTracks 시작");
  const session = await getSession();
  if (!session?.accessToken) {
    console.error("세션 또는 액세스 토큰이 없습니다.");
    return;
  }

  const limit = 50;
  let offset = 0;
  let allTracks = [];

  try {
    // 트랙 가져오기 로직 (변경 없음)
    // ...

    // 오디오 특성 가져오기
    const trackIds = allTracks.map((track) => track.id);
    console.log(
      `총 ${trackIds.length}개의 트랙에 대한 오디오 특성을 가져옵니다.`
    );
    const audioFeatures = await fetchAudioFeatures(
      trackIds,
      session.accessToken
    );

    // 트랙 데이터와 오디오 특성 결합
    const tracksWithAudioFeatures = allTracks.map((track, index) => ({
      ...track,
      audio_features: audioFeatures[index] || null,
    }));

    // 서버에 데이터 저장
    const saveResponse = await fetch("/api/saveTracks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracks: tracksWithAudioFeatures }),
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error(
        `트랙 저장 실패. 상태 코드: ${saveResponse.status}, 에러: ${errorText}`
      );
      throw new Error("트랙 데이터를 저장하는 데 실패했습니다.");
    }

    console.log("트랙 데이터가 성공적으로 저장되었습니다.");
    return tracksWithAudioFeatures;
  } catch (error) {
    console.error("fetchAndSaveTracks 에러:", error);
    throw error; // 에러를 상위로 전파하여 호출자가 처리할 수 있도록 합니다.
  }
}
