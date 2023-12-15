export interface User {
    id: number;
    login: string;
    email: string;
    imageUrl?: string;
    firstname?: string;
    lastname?: string;
	socketId?: string;
}
