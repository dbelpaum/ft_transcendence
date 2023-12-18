export enum ClientEvents {
	Ping = 'client.ping',
	ClientReady = 'client.lobby.ready',
	ClientUnready = 'client.lobby.unready',
	LobbyCreate = 'client.lobby.create',
	LobbyJoin = "client.lobby.join",
	LobbyLeave = "client.lobby.leave",
	ClientMovement = "client.game.move"
}