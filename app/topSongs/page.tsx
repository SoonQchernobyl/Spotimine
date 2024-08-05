"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Top.module.css";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
  audio_features: {
    tempo: number;
    speechiness: number;
    valence: number;
    acousticness: number;
  };
}

const features = ["tempo", "speechiness", "valence", "acousticness"];

function getColorForFeature(feature: string): string {
  const colors: Record<string, string> = {
    tempo: "#7a5ad4", // 채도를 낮춘 보라색
    speechiness: "#1a9d48", // 채도를 낮춘 초록색
    valence: "#e65c5c", // 채도를 낮춘 빨간색
    acousticness: "#3f7ec2", // 채도를 낮춘 파란색
  };
  return colors[feature] || "#000000";
}

export default function TopSongs() {
  const { data: session, status } = useSession();
  const [topTracks, setTopTracks] = useState<
    Record<string, { highest: Track; lowest: Track }>
  >({});
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && Object.keys(topTracks).length === 0) {
      fetchTopTracks();
    }
  }, [status, topTracks]);

  const fetchTopTracks = async () => {
    try {
      const response = await fetch("/api/getTopTracks");
      const data = await response.json();
      setTopTracks(data);
    } catch (error) {
      console.error("Failed to fetch top tracks:", error);
    }
  };

  const handleTrackClick = (trackId: string, feature: string) => {
    router.push(`/swipe?feature=${feature}&trackId=${trackId}`);
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
      <h1 className={styles.title}>Your Top Tracks</h1>
      {features.map((feature) => (
        <div key={feature} className={styles.featureSection}>
          <h2 className={styles.featureTitle}>
            {feature.charAt(0).toUpperCase() + feature.slice(1)}
          </h2>
          <div className={styles.boxContainer}>
            {["highest", "lowest"].map((extreme) => (
              <div
                key={extreme}
                className={styles.trackContainer}
                onClick={() =>
                  handleTrackClick(
                    topTracks[feature]?.[extreme as "highest" | "lowest"].id,
                    feature
                  )
                }
                style={{ backgroundColor: getColorForFeature(feature) }}
              >
                <h3>{extreme.charAt(0).toUpperCase() + extreme.slice(1)}</h3>
                <div className={styles.trackContent}>
                  <div className={styles.albumCover}>
                    <Image
                      src={
                        topTracks[feature]?.[extreme as "highest" | "lowest"]
                          ?.album.images[0]?.url ||
                        "https://via.placeholder.com/60"
                      }
                      alt={`${extreme} ${feature}`}
                      width={60}
                      height={60}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/60";
                      }}
                    />
                  </div>
                  <div className={styles.trackInfo}>
                    <div className={styles.trackName}>
                      {
                        topTracks[feature]?.[extreme as "highest" | "lowest"]
                          .name
                      }
                    </div>
                    <div className={styles.artistName}>
                      {
                        topTracks[feature]?.[extreme as "highest" | "lowest"]
                          .artists[0].name
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
