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
        },
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
      console.log('us:', user)

  console.log('rs:', user);
if (!user?._id && refreshToken) {
    // const newTokenResponse = await refreshAccessToken(refreshToken);
    const rs = await getRequest(`${BASE_API_URL}/auth/access-token`)
    console.log(rs)
        

    // console.log('new:', newTokenResponse)
    // if (newTokenResponse?.statusCode === 200) {
    //   user = await whoami(newTokenResponse.accessToken);
    // }
  }
    // if (user?.statusCode === 401 && refreshToken) {
    //     const newTokenResponse = await refreshAccessToken(refreshToken);

    //     if (newTokenResponse?.statusCode) {
    //         // console.log('newAT:', accessToken)
    //         // user = await whoami(newTokenResponse.accessToken);
    //     }
    // }  

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
