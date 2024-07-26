'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import styles from './styles.module.css';

interface Track {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
}

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
    Spotify: any;
  }
}

export default function Stream() {
  const { data: session, status } = useSession();
  const [track, setTrack] = useState<Track | null>(null);
  const searchParams = useSearchParams();
  const trackId = searchParams.get('trackId');

  useEffect(() => {
    const fetchTrack = async () => {
      if (session?.accessToken && trackId) {
        try {
          const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch track data');
          }
          const data = await response.json();
          setTrack(data);
        } catch (err) {
          console.error('Error fetching track:', err);
        }
      }
    };

    if (status === "authenticated") {
      fetchTrack();
    }
  }, [session, status, trackId]);

  useEffect(() => {
    const initializeSpotifyEmbed = () => {
      if (window.Spotify && trackId) {
        const element = document.getElementById('embed-iframe');
        if (element) {
          const options = {
            width: '100%',
            height: '80',
            uri: `spotify:track:${trackId}`
          };
          const callback = (EmbedController: any) => {
            console.log('Spotify Embed initialized');
          };
          window.Spotify.createController(element, options, callback);
        }
      }
    };

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      console.log('Spotify IFrame API is ready');
      window.Spotify = IFrameAPI;
      initializeSpotifyEmbed();
    };

    if (window.Spotify) {
      initializeSpotifyEmbed();
    }
  }, [trackId]);

  if (status === "loading" || !track) {
    return <div className={styles.container}>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div className={styles.container}>Please sign in to view this track</div>
  }

  return (
    <div className={styles.container}>
      <Script 
        src="https://open.spotify.com/embed/iframe-api/v1" 
        strategy="afterInteractive"
      />
      <div className={styles.albumCover}>
        <Image src={track.album.images[0].url} alt={track.album.name} width={300} height={300} />
      </div>
      <div className={styles.trackInfo}>
        <h1 className={styles.trackName}>{track.name}</h1>
        <p className={styles.artistName}>{track.artists.map(artist => artist.name).join(', ')}</p>
      </div>
      <div id="embed-iframe" className={styles.spotifyEmbed}></div>
    </div>
  );
}