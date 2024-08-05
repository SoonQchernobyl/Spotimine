import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FeatureBoxProps {
  albumCoverUrl: string;
  backgroundColor: string;
  trackId: string;
  feature: string;
  isHighest: boolean;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ albumCoverUrl, backgroundColor, trackId, feature, isHighest }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/swipe?feature=${feature}&trackId=${trackId}`);
  };

  return (
    <div 
      className="feature-box" 
      style={{ backgroundColor }}
      onClick={handleClick}
    >
      <h3>{isHighest ? 'Highest' : 'Lowest'}</h3>
      <div className="album-cover">
        <Image 
          src={albumCoverUrl || '/placeholder-album.png'} 
          alt={`${isHighest ? 'Highest' : 'Lowest'} ${feature}`} 
          width={60} 
          height={60} 
          onError={(e) => {
            e.currentTarget.src = '/placeholder-album.png';
          }}
        />
      </div>
      <style jsx>{`
        .feature-box {
          width: 150px;
          height: 150px;
          padding: 10px;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          margin: 10px;
        }
        h3 {
          color: white;
          margin: 0;
        }
        .album-cover {
          position: absolute;
          bottom: 10px;
          right: 10px;
          transform: rotate(15deg);
        }
      `}</style>
    </div>
  );
};

export default FeatureBox;