"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./SelectFeature.module.css";

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

const SelectFeaturePage = () => {
  const [extremeTracks, setExtremeTracks] = useState<
    Record<string, { highest: Track; lowest: Track }>
  >({});
  const router = useRouter();

  useEffect(() => {
    fetchExtremeTracks();
  }, []);

  const fetchExtremeTracks = async () => {
    try {
      const response = await fetch("/api/getExtremeTracks");
      const data = await response.json();
      setExtremeTracks(data);
    } catch (error) {
      console.error("Failed to fetch extreme tracks:", error);
    }
  };

  const handleClick = (trackId: string, feature: string) => {
    router.push(`/swipe?trackId=${trackId}&feature=${feature}`);
  };

  return (
    <div className={styles.container}>
      <h1>Select Audio Feature</h1>
      <div className={styles.boxContainer}>
        {features.map((feature) => (
          <React.Fragment key={feature}>
            {["highest", "lowest"].map((extreme) => (
              <div
                key={`${feature}-${extreme}`}
                className={styles.featureBox}
                style={{ backgroundColor: getColorForFeature(feature) }}
                onClick={() =>
                  handleClick(extremeTracks[feature]?.[extreme]?.id, feature)
                }
              >
                <h3>{`${
                  extreme.charAt(0).toUpperCase() + extreme.slice(1)
                } ${feature}`}</h3>
                <div className={styles.albumCover}>
                  <Image
                    src={
                      extremeTracks[feature]?.[extreme]?.album.images[0]?.url ||
                      "/404.jpg"
                    }
                    alt={`${extreme} ${feature}`}
                    width={60}
                    height={60}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/404.jpg";
                    }}
                  />
                </div>
                <div className={styles.trackInfo}>
                  <div className={styles.trackName}>
                    {extremeTracks[feature]?.[extreme]?.name}
                  </div>
                  <div className={styles.artistName}>
                    {extremeTracks[feature]?.[extreme]?.artists[0]?.name}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

function getColorForFeature(feature: string): string {
  const colors: Record<string, string> = {
    tempo: "#7a5ad4",
    speechiness: "#1a9d48",
    valence: "#e65c5c",
    acousticness: "#3f7ec2",
  };
  return colors[feature] || "#000000";
}

export default SelectFeaturePage;
