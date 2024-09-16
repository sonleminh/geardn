export interface IUser {
    _id?: string;
    name: string;
}
export interface IWhoIAmResponse {
    _id: string;
    name: string;
    email: string;
    exp: number;
    iat: number;
    statusCode: number;
  }