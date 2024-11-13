import { JwtPayload } from "jwt-decode";

export interface IError {
  message: string;
  error: string;
  statusCode: number;
}