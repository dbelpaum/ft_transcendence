import React from 'react';
import { PulseLoader } from "react-spinners";

export interface ButtonsComponentProps {
    isMatchmaking: boolean;
    handleMatchmaking: () => void;
}


const MatchMackingButton: React.FC<ButtonsComponentProps> = ({ isMatchmaking, handleMatchmaking }) => {
    return (
		<div className="button-card" onClick={handleMatchmaking}>
			<div className="button-card-content">
				<button>
					Matchmaking {isMatchmaking && <PulseLoader size={10} color={"#ffffff"} />}
	  			</button>
			</div>
	  </div>
    );
};

export default MatchMackingButton;
