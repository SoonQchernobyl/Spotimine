import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log("POST 요청 받음: /api/saveTracks");

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const { tracks } = await request.json();
    console.log(`받은 트랙 수: ${tracks.length}`);

    // 사용자 정보 저장 또는 업데이트
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        spotifyId: session.user.id || "", // Spotify ID가 없을 경우 빈 문자열 사용
      },
    });

    let savedCount = 0;
    for (const track of tracks) {
      try {
        const savedTrack = await prisma.track.upsert({
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

        // UserSavedTrack 생성 또는 업데이트
        await prisma.userSavedTrack.upsert({
          where: {
            userId_trackId: {
              userId: user.id,
              trackId: savedTrack.id,
            },
          },
          update: {
            addedAt: new Date(track.added_at), // 트랙의 added_at 정보로 업데이트
          },
          create: {
            userId: user.id,
            trackId: savedTrack.id,
            addedAt: new Date(track.added_at), // 트랙의 added_at 정보로 생성
          },
        });

        savedCount++;
      } catch (error) {
        console.error(`트랙 저장 중 오류 발생 (ID: ${track.id}):`, error);
      }
    }

    console.log(`${savedCount}개의 트랙이 성공적으로 저장되었습니다.`);
    return NextResponse.json({
      message: `${savedCount}개의 트랙이 성공적으로 저장되었습니다.`,
    });
  } catch (error) {
    console.error("트랙 저장 중 오류 발생:", error);
    return NextResponse.json(
      { error: "트랙 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
