"use client";

import React, { useEffect, useState } from "react";
import FeatureBox from "../../../ui/FeatureBox";
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

  return (
    <div className={styles.container}>
      <h1>Select Audio Feature</h1>
      <div className={styles.boxContainer}>
        {features.map((feature) => (
          <React.Fragment key={feature}>
            <FeatureBox
              title={`Highest ${feature}`}
              albumCoverUrl={
                extremeTracks[feature]?.highest.album.images[0].url || ""
              }
              backgroundColor={getColorForFeature(feature)}
              trackId={extremeTracks[feature]?.highest.id || ""}
              feature={feature}
            />
            <FeatureBox
              title={`Lowest ${feature}`}
              albumCoverUrl={
                extremeTracks[feature]?.lowest.album.images[0].url || ""
              }
              backgroundColor={getColorForFeature(feature)}
              trackId={extremeTracks[feature]?.lowest.id || ""}
              feature={feature}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

function getColorForFeature(feature: string): string {
  const colors: Record<string, string> = {
    tempo: "#7a5ad4",      // 채도를 낮춘 보라색
    speechiness: "#1a9d48", // 채도를 낮춘 초록색
    valence: "#e65c5c",    // 채도를 낮춘 빨간색
    acousticness: "#3f7ec2", // 채도를 낮춘 파란색
  };
  return colors[feature] || "#000000";
}

export default SelectFeaturePage;
