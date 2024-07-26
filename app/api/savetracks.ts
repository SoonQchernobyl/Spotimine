import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { tracks } = req.body;

      // 사용자 찾기 또는 생성
      const user = await prisma.user.upsert({
        where: { spotifyId: session.user.id },
        update: {},
        create: { spotifyId: session.user.id, email: session.user.email },
      });

      // 각 트랙에 대해 처리
      for (const track of tracks) {
        // 트랙 생성 또는 업데이트
        const savedTrack = await prisma.track.upsert({
          where: { spotifyId: track.id },
          update: {},
          create: {
            spotifyId: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            durationMs: track.duration_ms,
            popularity: track.popularity,
            previewUrl: track.preview_url,
          },
        });

        // 오디오 특성 생성 또는 업데이트
        await prisma.audioFeatures.upsert({
          where: { trackId: savedTrack.id },
          update: track.audio_features,
          create: {
            trackId: savedTrack.id,
            ...track.audio_features,
          },
        });

        // 사용자와 트랙 연결
        await prisma.userSavedTrack.upsert({
          where: {
            userId_trackId: {
              userId: user.id,
              trackId: savedTrack.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            trackId: savedTrack.id,
            addedAt: new Date(),
          },
        });
      }

      res.status(200).json({ message: "Tracks saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error saving tracks" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
