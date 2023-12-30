import React from 'react';
import { PulseLoader } from "react-spinners";

export interface ButtonsComponentProps {
    isMatchmaking: boolean;
    handleJoinRoom: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    roomCode: string;
    handleRoomCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


const JoinRoomButton: React.FC<ButtonsComponentProps> = ({ isMatchmaking, handleJoinRoom, handleKeyDown, roomCode,  handleRoomCodeChange}) => {
    return (
		<div className="join">
			<div className="button-card" onClick={handleJoinRoom}>
				<div className="button-card-content">
					<button>
						Join Room
	  				</button>
				</div>
	  		</div>
			<input
			placeholder="Room Code"
			onKeyDown={handleKeyDown}
			className="inputBar"
			value={roomCode}
			onChange={handleRoomCodeChange}
			></input>
		</div>
    );
};


export default JoinRoomButton;
