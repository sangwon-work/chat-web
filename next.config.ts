import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /*
  * 쿠키의 소유자(호스트) 차이
  * 지금 refresh 쿠키는 **백엔드 호스트(localhost:3001)**에 저장돼 있어요.
  * Next.js Middleware는 3000 호스트로 들어오는 요청만 볼 수 있습니다.
  * 즉, 미들웨어는 3001에 속한 쿠키를 볼 수 없어요 → 백엔드로 검증 호출을 해도 쿠키를 못 실어서 401.
  *
  * 목표: refresh 쿠키를 3000(프런트 호스트)에 저장 → 미들웨어가 읽을 수 있게 함.
  * */
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://localhost:3001/:path*' },
    ];
  },
  // 필요 시 추가 옵션…
};

export default nextConfig;
