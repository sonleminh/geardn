import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react'
import { BASE_API_URL } from './constants/env';
import { getRequest } from './utils/fetch-client';
import { IWhoIAmResponse } from './interfaces/IUser';
import { IRefreshTokenResponse } from './interfaces/IAuth';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const protectedRoute = ['/profile'];
const publicRoute = ['/login'];

async function whoami(accessToken: RequestCookie | undefined): Promise<IWhoIAmResponse | null> {
    try {
      return await getRequest(`${BASE_API_URL}/auth/whoami`, {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `at=${accessToken?.value}`,
          // 'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      }) as IWhoIAmResponse;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  }

async function refreshAccessToken(refreshToken: RequestCookie | undefined): Promise<IRefreshTokenResponse | null> {
if (!refreshToken) return null;

try {
    return await getRequest(`${BASE_API_URL}/auth/refresh-token`, {
    headers: {
        'Content-Type': 'application/json',
        Cookie: `rt=${refreshToken?.value}`,
    },
    }) as IRefreshTokenResponse;
} catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
}
}

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('at');
  const refreshToken = cookieStore.get('rt');

  let user = await whoami(accessToken)

  if (!user?._id && refreshToken) {
    const response = NextResponse.next();
    const newTokenResponse = await refreshAccessToken(refreshToken);
    if (newTokenResponse?.accessToken) {
      response.cookies.set('at', newTokenResponse?.accessToken,  {
        path: '/',
      });
      return response;
    } else {
      const response = NextResponse.redirect(new URL('/login', request.url));
 
      response.cookies.set('at', '', { maxAge: 0 });
      response.cookies.set('rt', '', { maxAge: 0 });
      return response;
    }
  }

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoute.includes(path);
  const isPublicRoute = publicRoute.includes(path);

  if (isProtectedRoute && !user?._id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicRoute && user?._id) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  return NextResponse.next();
}
