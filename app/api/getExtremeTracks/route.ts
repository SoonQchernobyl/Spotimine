import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAlbumCoverUrl } from "@/utils/spotifyApi";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("Authorization")?.split(" ")[1];
  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token provided" },
      { status: 401 }
    );
  }

  try {
    const features = ["tempo", "speechiness", "valence", "acousticness"];
    const result = {};

    for (const feature of features) {
      const [highest, lowest] = await Promise.all([
        prisma.track.findFirst({
          where: {
            audioFeatures: {
              [feature]: { not: 0 },
            },
          },
          orderBy: {
            audioFeatures: {
              [feature]: "desc",
            },
          },
          include: { audioFeatures: true },
        }),
        prisma.track.findFirst({
          where: {
            audioFeatures: {
              [feature]: { not: 0 },
            },
          },
          orderBy: {
            audioFeatures: {
              [feature]: "asc",
            },
          },
          include: { audioFeatures: true },
        }),
      ]);

      if (!highest || !lowest) {
        console.error(`No tracks found for feature: ${feature}`);
        continue;
      }

      const [highestCoverUrl, lowestCoverUrl] = await Promise.all([
        getAlbumCoverUrl(highest.spotifyId, accessToken),
        getAlbumCoverUrl(lowest.spotifyId, accessToken),
      ]);

      result[feature] = {
        highest: {
          id: highest.spotifyId,
          album: { images: [{ url: highestCoverUrl }] },
        },
        lowest: {
          id: lowest.spotifyId,
          album: { images: [{ url: lowestCoverUrl }] },
        },
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in getExtremeTracks:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
