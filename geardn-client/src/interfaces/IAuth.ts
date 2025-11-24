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
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface IWhoAmIResponse {
    id: string;
    email: string;
    name: string;
    role: string;
    picture: string;
}
export interface ILogoutResponse {
  message: string;
  statusCode: number;
}

export interface ISignUpResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  status: number;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  expires: number;
  statusCode: number;
}

export interface ICustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string
}