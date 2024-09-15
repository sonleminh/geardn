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
  fullName: string;
  role: string;
  _id: string;
  status: number;
  message: string;
}

export interface ISignUpResponse {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  status: number;
  message: string;
}

export interface IRefreshTokenResponse {
  message: string;
  statusCode: number;
}