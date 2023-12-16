import { Socket } from "socket.io";
import { Lobby } from "../lobby/lobby";

export class Instance {
	public hasStarted: boolean = false;

	public hasFinished: boolean = false;

	public isSuspended: boolean = false;

	public scores: Record<Socket['id'], number> = {};
	constructor(
		private readonly lobby: Lobby,
	)
	{}
}