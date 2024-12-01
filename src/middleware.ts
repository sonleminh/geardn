import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react'
import { BASE_API_URL } from './constants/env';
import { getRequest } from './utils/fetch-client';
import { IWhoIAmResponse } from './interfaces/IUser';
import { ICustomJwtPayload, IRefreshTokenResponse } from './interfaces/IAuth';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { JwtPayload, jwtDecode } from 'jwt-decode';

const protectedRoute = ['/tai-khoan'];
const publicRoute = ['/dang-nhap'];

async function whoami(accessToken: RequestCookie | undefined): Promise<IWhoIAmResponse | null> {
    try {
      return await getRequest(`/auth/whoami`, {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `at=${accessToken?.value}`,
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
      return await getRequest(`/auth/refresh-token`, {
      headers: {
          'Content-Type': 'application/json',
          Cookie: `rt=${refreshToken?.value}`
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
  const googleCredentials = cookieStore.get('GC');
  
  let user: IWhoIAmResponse | null = null;

    if (googleCredentials) {
      const credentialDecoded = jwtDecode(
          googleCredentials?.value
        ) as ICustomJwtPayload;
        if (credentialDecoded) {
          user = { _id: credentialDecoded?.sub, email: credentialDecoded?.email, name: credentialDecoded?.name || '' }; 
        }
    }
  if(!googleCredentials)
    {
    user = await whoami(accessToken)

    if (!user?._id && refreshToken) {
      const response = NextResponse.next();
      const newTokenResponse = await refreshAccessToken(refreshToken);

        if (newTokenResponse?.accessToken) {
          const expires = new Date();
          expires.setHours(expires.getHours() + newTokenResponse.expires);
          response.cookies.set('at', newTokenResponse?.accessToken,  {
            path: '/',
            expires: expires,
          });
        return response;
      } else {
        const response = NextResponse.redirect(new URL('/tai-khoan', request.url));
  
        response.cookies.set('at', '', { maxAge: 0 });
        response.cookies.set('rt', '', { maxAge: 0 });
        return response;
      }
    }
  }

  const path = request.nextUrl.pathname;
  // console.log('path: ', path);
  const isProtectedRoute = protectedRoute.includes(path);
  const isPublicRoute = publicRoute.includes(path);

  if (isProtectedRoute && !user?._id) {
    return NextResponse.redirect(new URL('/dang-nhap', request.url));
  }

  if (isPublicRoute && user?._id) {
    return NextResponse.redirect(new URL('/tai-khoan', request.url));
  }
  return NextResponse.next();
}