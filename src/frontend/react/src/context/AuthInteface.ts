export interface User {
    id: number;
    id42: number;
    pseudo: string;
    email: string;
    imageURL: string;
    firstname: string;
    lastname: string;
	socketId?: string;
}

export interface Info2FA{
	need2fa: boolean,
	id: number,
	pseudo: string
}