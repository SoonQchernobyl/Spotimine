import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./FeatureBox.module.css";

interface FeatureBoxProps {
  albumCoverUrl: string;
  backgroundColor: string;
  trackId: string;
  feature: string;
  isHighest: boolean;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({
  albumCoverUrl,
  backgroundColor,
  trackId,
  feature,
  isHighest,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/stream?feature=${feature}&trackId=${trackId}`);
  };

  return (
    <div
      className={styles.featureBox}
      style={{ backgroundColor }}
      onClick={handleClick}
    >
      <h3>{isHighest ? "Highest" : "Lowest"}</h3>
      <div className={styles.albumCover}>
        <Image
          src={albumCoverUrl || "/404.jpg"}
          alt={`${isHighest ? "Highest" : "Lowest"} ${feature}`}
          width={60}
          height={60}
          onError={(e) => {
            e.currentTarget.src = "/404.jpg";
          }}
        />
      </div>
    </div>
  );
};

export default FeatureBox;