export interface IUser {
    _id?: string;
    name: string;
}

export interface ISignInResponse {
    message: string;
    user: {
        _id?: string;
        name: string;
        accessToken: string;
        refreshToken: string;
    }
}