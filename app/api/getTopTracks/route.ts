import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const features = ["tempo", "speechiness", "valence", "acousticness"];
    const result = {};

    for (const feature of features) {
      const [highest, lowest] = await Promise.all([
        prisma.track.findFirst({
          where: { audioFeatures: { [feature]: { not: null } } },
          orderBy: { audioFeatures: { [feature]: "desc" } },
          include: { audioFeatures: true },
        }),
        prisma.track.findFirst({
          where: { audioFeatures: { [feature]: { not: null } } },
          orderBy: { audioFeatures: { [feature]: "asc" } },
          include: { audioFeatures: true },
        }),
      ]);

      result[feature] = {
        highest: {
          id: highest.spotifyId,
          name: highest.name,
          artists: [{ name: highest.artist }],
          album: { images: [{ url: highest.albumCoverUrl }] },
          audio_features: highest.audioFeatures,
        },
        lowest: {
          id: lowest.spotifyId,
          name: lowest.name,
          artists: [{ name: lowest.artist }],
          album: { images: [{ url: lowest.albumCoverUrl }] },
          audio_features: lowest.audioFeatures,
        },
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in getTopTracks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
