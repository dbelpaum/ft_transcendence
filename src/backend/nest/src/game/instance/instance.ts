import { Socket } from "socket.io";
import { Lobby } from "../lobby/lobby";
import { ServerPayloads } from "../shared/server/ServerPayloads";
import { ServerEvents } from "../shared/server/ServerEvents";

export class Instance {
	public hasStarted: boolean = false;

	public hasFinished: boolean = false;

	public isSuspended: boolean = false;

	public scores: Record<Socket['id'], number> = {};
	constructor(
		private readonly lobby: Lobby,
	) { }

	public triggerStart(): void {
		if (this.hasStarted) {
			return;
		}

		this.hasStarted = true;
		this.lobby.dispatchToLobby(ServerEvents.GameStart, {});

		
	}
}