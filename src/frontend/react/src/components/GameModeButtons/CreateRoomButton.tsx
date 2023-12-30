import React from 'react';
import { PulseLoader } from "react-spinners";

export interface ButtonsComponentProps {
    isMatchmaking: boolean;
    handleCreateRoom: () => void;
}


const CreateRoomButton: React.FC<ButtonsComponentProps> = ({ isMatchmaking, handleCreateRoom }) => {
    return (
		<div className={`buttonStyle ${isMatchmaking ? "button-card darkened " : "button-card"}`} onClick={handleCreateRoom}>
			<div className="button-card-content">
				<button className="create-room">
					Create Room
	  			</button>
			</div>
	  </div>
    );
};

export default CreateRoomButton;
