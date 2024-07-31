"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Top.module.css";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  audio_features?: {
    tempo: number;
    speechiness: number;
    valence: number;
    acousticness: number;
  };
}

const characteristicMap = [
  { title: "Most High Tempo", feature: "tempo" },
  { title: "Most Talkative", feature: "speechiness" },
  { title: "Most Positive", feature: "valence" },
  { title: "Most Acoustic", feature: "acousticness" },
];

export default function Top5() {
  const { data: session, status } = useSession();
  const [distinctTracks, setDistinctTracks] = useState<Track[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAllSavedTracks = async (
      accessToken: string
    ): Promise<Track[]> => {
      let allTracks: Track[] = [];
      let nextUrl = "https://api.spotify.com/v1/me/tracks?limit=50";

      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        allTracks = [
          ...allTracks,
          ...data.items.map((item: any) => item.track),
        ];
        nextUrl = data.next;
      }

      return allTracks;
    };

    const fetchAudioFeatures = async (
      trackIds: string[],
      accessToken: string
    ) => {
      const response = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return await response.json();
    };

    const fetchDistinctTracks = async () => {
      if (status === "authenticated" && session?.accessToken) {
        try {
          // 로컬 스토리지에서 캐시된 데이터 확인
          const cachedData = localStorage.getItem("distinctTracks");
          if (cachedData) {
            setDistinctTracks(JSON.parse(cachedData));
            return;
          }

          const savedTracks = await fetchAllSavedTracks(session.accessToken);

          // 50개씩 나누어 오디오 특성 가져오기
          const audioFeatures = [];
          for (let i = 0; i < savedTracks.length; i += 50) {
            const chunk = savedTracks.slice(i, i + 50);
            const chunkFeatures = await fetchAudioFeatures(
              chunk.map((track) => track.id),
              session.accessToken
            );
            audioFeatures.push(...chunkFeatures.audio_features);
          }

          const tracksWithFeatures = savedTracks.map((track, index) => ({
            ...track,
            audio_features: audioFeatures[index],
          }));

          const highestTempo = tracksWithFeatures.reduce((prev, current) =>
            (prev.audio_features?.tempo ?? 0) >
            (current.audio_features?.tempo ?? 0)
              ? prev
              : current
          );
          const highestSpeechiness = tracksWithFeatures.reduce(
            (prev, current) =>
              (prev.audio_features?.speechiness ?? 0) >
              (current.audio_features?.speechiness ?? 0)
                ? prev
                : current
          );
          const highestValence = tracksWithFeatures.reduce((prev, current) =>
            (prev.audio_features?.valence ?? 0) >
            (current.audio_features?.valence ?? 0)
              ? prev
              : current
          );
          const highestAcousticness = tracksWithFeatures.reduce(
            (prev, current) =>
              (prev.audio_features?.acousticness ?? 0) >
              (current.audio_features?.acousticness ?? 0)
                ? prev
                : current
          );

          const distinctTracks = [
            highestTempo,
            highestSpeechiness,
            highestValence,
            highestAcousticness,
          ];
          setDistinctTracks(distinctTracks);

          // 결과를 로컬 스토리지에 캐싱
          localStorage.setItem(
            "distinctTracks",
            JSON.stringify(distinctTracks)
          );
        } catch (error) {
          console.error("트랙 데이터 가져오기 실패:", error);
        }
      }
    };

    fetchDistinctTracks();
  }, [session, status]);

  const handleTrackClick = (trackId: string, feature: string) => {
    router.push(`/stream?trackId=${trackId}&feature=${feature}`);
  };

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className={styles.error}>Please sign in to view your top tracks</div>
    );
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Distinct Tracks</h1>
      {distinctTracks.map((track, index) => (
        <div
          key={track.id}
          className={styles.trackContainer}
          onClick={() =>
            handleTrackClick(track.id, characteristicMap[index].feature)
          }
        >
          <h2 className={styles.subtitle}>{characteristicMap[index].title}</h2>
          <div className={styles.trackContent}>
            <div className={styles.albumCover}>
              {track.album.images[0] && (
                <Image
                  src={track.album.images[0].url}
                  alt={`${track.album.name} cover`}
                  width={60}
                  height={60}
                  layout="responsive"
                />
              )}
            </div>
            <div className={styles.trackInfo}>
              <div className={styles.trackName}>{track.name}</div>
              <div className={styles.artistName}>{track.artists[0].name}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
