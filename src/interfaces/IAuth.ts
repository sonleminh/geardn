import { JwtPayload } from "jwt-decode";

export interface ILoginInPayload {
  username: string;
  password: string;
}

export interface ISignUpPayload {
  username: string;
  email: string;
  name: string;
  password: string;
}

export interface ILogInResponse {
  email: string;
  name: string;
  role: string;
  _id: string;
  statusCode: number;
  message: string;
}

export interface ILogoutResponse {
  message: string;
  statusCode: number;
}

export interface ISignUpResponse {
  _id: string;
  email: string;
  name: string;
  role: string;
  status: number;
  message: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  statusCode: number;
}

export interface ICustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string
}