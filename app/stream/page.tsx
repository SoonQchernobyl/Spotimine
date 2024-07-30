import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import StreamComponent from "./StreamComponent";

export default async function StreamPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const trackId = searchParams.trackId;

  if (!session) {
    return <div>Please sign in to view this track</div>;
  }

  const trackResponse = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );
  const trackData = await trackResponse.json();

  return (
    <StreamComponent
      key={trackId}
      initialTrackData={trackData}
      trackId={trackId}
      selectedFeature={searchParams.feature || "tempo"} // 기본값 설정
    />
  );
}
