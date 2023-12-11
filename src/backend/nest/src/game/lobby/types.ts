import { Socket } from 'socket.io';
import { ServerEvents } from 'src/game/shared/ServerEvents';
import { Lobby } from 'src/game/lobby/lobby';

export type AuthenticatedSocket = Socket & {
	data: {
		lobby: null | Lobby;	// pas sûr de comprendre
		//As you can see, within data key (which is a handy key provided by Socket.IO on Socket object, 
		//you can put anything you want in it), I declare a lobby subkey, this will be used later to attach a lobby to the client.
	};

	// Override de la méthode emit pour avoir uniquement des ServerEvents
	emit: <T>(ev: ServerEvents, data: T) => boolean;
}