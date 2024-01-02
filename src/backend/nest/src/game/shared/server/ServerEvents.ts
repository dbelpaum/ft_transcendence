export enum ServerEvents {
	Pong = "server.pong",
	LobbyState = "server.lobby.state",
	GameStart = "server.game.start",
	GameMessage = "server.game.message",
	GameState = "server.game.state",
	GameError = "server.game.error",
	GameOver = "server.game.over",
	GameGuestPosition = "server.game.guestposition",
	MatchmakingStatus = "server.matchmaking.status",
	MatchmakingFound = "server.matchmaking.found",
	GetUserStatus = "server.getuserstatus",
}
