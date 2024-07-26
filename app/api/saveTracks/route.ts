import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log('POST 요청 받음: /api/saveTracks');
  
  try {
    const { tracks } = await request.json();
    console.log(`받은 트랙 수: ${tracks.length}`);

    let savedCount = 0;
    for (const track of tracks) {
      try {
        await prisma.track.upsert({
          where: { spotifyId: track.id },
          update: {
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            audioFeatures: {
              upsert: {
                create: {
                  tempo: track.audio_features?.tempo,
                  acousticness: track.audio_features?.acousticness,
                  speechiness: track.audio_features?.speechiness,
                  valence: track.audio_features?.valence,
                },
                update: {
                  tempo: track.audio_features?.tempo,
                  acousticness: track.audio_features?.acousticness,
                  speechiness: track.audio_features?.speechiness,
                  valence: track.audio_features?.valence,
                },
              },
            },
          },
          create: {
            spotifyId: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            audioFeatures: {
              create: {
                tempo: track.audio_features?.tempo,
                acousticness: track.audio_features?.acousticness,
                speechiness: track.audio_features?.speechiness,
                valence: track.audio_features?.valence,
              },
            },
          },
        });
        savedCount++;
      } catch (error) {
        console.error(`트랙 저장 중 오류 발생 (ID: ${track.id}):`, error);
      }
    }

    console.log(`${savedCount}개의 트랙이 성공적으로 저장되었습니다.`);
    return NextResponse.json({ message: `${savedCount}개의 트랙이 성공적으로 저장되었습니다.` });
  } catch (error) {
    console.error('트랙 저장 중 오류 발생:', error);
    return NextResponse.json({ error: '트랙 저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}