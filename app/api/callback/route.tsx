import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (code) {
    // 여기서 액세스 토큰을 얻기 위한 요청을 Spotify API에 보냅니다.
    // 액세스 토큰을 얻은 후, 그것을 저장하거나 사용합니다.
    
    // Spotify API로 액세스 토큰을 요청하는 로직
    // 이 부분은 실제 구현시 추가해야 합니다.
    
    // Top5 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/top5', request.url));
  } else {
    // 에러 처리: 코드가 없는 경우 홈페이지로 리다이렉트
    return NextResponse.redirect(new URL('/', request.url));
  }
}