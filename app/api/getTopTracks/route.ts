import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const feature = searchParams.get("feature");
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const tracks = await prisma.track.findMany({
    include: { audioFeatures: true },
    orderBy: { audioFeatures: { [feature]: "desc" } },
    take: limit,
  });

  return NextResponse.json(tracks);
}
