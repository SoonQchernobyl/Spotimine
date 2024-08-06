"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
    tempo: "#7a5ad4",
    speechiness: "#1a9d48",
    valence: "#e65c5c",
    acousticness: "#3f7ec2",
  };
  return colors[feature] || "#000000";
}

const TopSongs: React.FC = () => {
  const { data: session, status } = useSession();
  const [topTracks, setTopTracks] = useState<
    Record<string, { highest: Track; lowest: Track }>
  >({});

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchTopTracks(session.accessToken);
    }
  }, [status, session]);

  const fetchTopTracks = async (accessToken: string) => {
    try {
      const response = await fetch("/api/getExtremeTracks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTopTracks(data);
    } catch (error) {
      console.error("Failed to fetch top tracks:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to view your top tracks</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Top Tracks</h1>
      {features.map((feature) => (
        <div key={feature} className={styles.featureSection}>
          <h2 className={styles.featureTitle}>{feature}</h2>
          <div className={styles.boxContainer}>
            {["highest", "lowest"].map((extreme) => (
              <div
                key={`${feature}-${extreme}`}
                className={styles.featureBox}
                style={{ backgroundColor: getColorForFeature(feature) }}
              >
                <h3>{extreme.charAt(0).toUpperCase() + extreme.slice(1)}</h3>
                <div className={styles.albumCover}>
                  <Image
                    src={
                      topTracks[feature]?.[extreme as "highest" | "lowest"]
                        ?.album?.images[0]?.url || "/404.jpg"
                    }
                    alt={`${extreme} ${feature}`}
                    width={80}
                    height={80}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/404.jpg";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopSongs;
