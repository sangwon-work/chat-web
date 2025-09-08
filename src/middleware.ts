import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    // '/chat/:path*',
    // '/friend/:path*',
  ],
}

/**
 * 사용 안함
 * @param request
 */
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  try {
    const refreshtoken = request.cookies.get('refreshtoken')?.value;
    // const response = await postRefreshToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshtoken=${refreshtoken}`
      }
    })
    const data = await response.json();

    const res = NextResponse.next();
    if (data.resCode === '0000') {
      res.cookies.set('accesstoken', data.body.accesstoken, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60,
      });
      return res;
    } else {
      url.pathname = "/login";
      url.searchParams.set("reason", "expired");
      url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    url.pathname = "/login";
    url.searchParams.set("reason", "expired");
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
