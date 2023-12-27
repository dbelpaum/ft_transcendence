import { IsBoolean, IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class LobbyCreateDto {
	@IsString()
	mode: 'vanilla' | 'special';
}

export class LobbyJoinDto {
	@IsString()
	lobbyId: string;
}

export class ClientMovementDto {
	@IsBoolean()
	movingLeft: boolean;

	@IsBoolean()
	movingRight: boolean;
}