import { getSession } from "next-auth/react";

async function fetchAudioFeatures(trackIds: string[], accessToken: string) {
  const batchSize = 100;
  let allAudioFeatures = [];

  for (let i = 0; i < trackIds.length; i += batchSize) {
    const batch = trackIds.slice(i, i + batchSize);
    console.log(
      `오디오 특성 가져오기: ${i + 1}에서 ${i + batch.length}까지의 트랙`
    );
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
    console.log(`가져온 오디오 특성 수: ${data.audio_features.length}`);
    allAudioFeatures = [...allAudioFeatures, ...(data.audio_features || [])];
  }

  console.log(`총 ${allAudioFeatures.length}개의 오디오 특성을 가져왔습니다.`);
  return allAudioFeatures;
}

export async function fetchAndSaveTracks() {
  console.log("fetchAndSaveTracks 시작");
  const session = await getSession();
  console.log("세션:", JSON.stringify(session, null, 2));
  console.log("액세스 토큰:", session?.accessToken ? "존재함" : "없음");

  if (!session?.accessToken) {
    console.error("세션 또는 액세스 토큰이 없습니다.");
    return;
  }

  const limit = 50;
  let offset = 0;
  let allTracks = [];

  try {
    while (true) {
      console.log(`트랙 가져오기 시도: offset ${offset}, limit ${limit}`);
      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      console.log(`Spotify API 응답 상태: ${response.status}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("The access token expired");
        }
        throw new Error(`API 요청 실패: ${response.status}`);
        // console.error(
        //   `트랙 데이터 가져오기 실패. 상태 코드: ${response.status}`
        // );
        // const errorText = await response.text();
        // console.error(`에러 내용: ${errorText}`);
        // throw new Error(
        //   `트랙 데이터를 가져오는 데 실패했습니다. 상태 코드: ${response.status}`
        // );
      }

      const data = await response.json();
      console.log(`가져온 트랙 수: ${data.items.length}`);
      const tracks = data.items.map((item) => item.track);
      allTracks = [...allTracks, ...tracks];

      if (data.next) {
        offset += limit;
      } else {
        break;
      }
    }

    console.log(`총 ${allTracks.length}개의 트랙을 가져왔습니다.`);

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
      added_at: track.added_at, // added_at 정보 포함
    }));

    // 서버에 데이터 저장
    console.log("서버에 데이터 저장 시도");
    console.log(`저장할 트랙 수: ${tracksWithAudioFeatures.length}`);
    const saveResponse = await fetch("/api/saveTracks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracks: tracksWithAudioFeatures }),
    });

    if (!saveResponse.ok) {
      console.error(`트랙 저장 실패. 상태 코드: ${saveResponse.status}`);
      const errorBody = await saveResponse.text();
      console.error(`응답 내용: ${errorBody}`);
      throw new Error(
        `트랙 데이터를 저장하는 데 실패했습니다. 상태 코드: ${saveResponse.status}`
      );
    }

    const saveResult = await saveResponse.json();
    console.log("서버 응답:", saveResult);

    console.log("트랙 데이터가 성공적으로 저장되었습니다.");
    return tracksWithAudioFeatures;
  } catch (error) {
    console.error("fetchAndSaveTracks 에러:", error);
    if (error instanceof Error) {
      console.error("에러 메시지:", error.message);
      console.error("스택 트레이스:", error.stack);
    }
    throw error;
  }
}
export async function getAlbumCoverUrl(trackId: string, accessToken: string) {
  if (!accessToken) throw new Error("No access token provided");

  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch track info: ${response.statusText}`);
  }

  const data = await response.json();
  return data.album.images[0]?.url || null;
}


