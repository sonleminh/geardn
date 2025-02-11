export interface IUser {
    id?: string;
    email: string;
    name: string;
    picture?: string;
}
export interface IWhoIAmResponse {
    id?: string;
    name?: string;
    email?: string;
    exp?: number;
    iat?: number;
    statusCode?: number;
  }