import React, { useState, useEffect, useRef, useContext } from 'react';
import {
	Channel,
  ChannelUtility,
	Message,
	addAdminInfo,
	MpChannel,
  } from '../chat.interface';
import { User } from '../../../context/AuthInteface';
import crownIconPath from '../assets/couronne.svg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import SocketContext from '../../Game/SocketContext';
import { Socket } from "socket.io-client";
import { useAuth } from '../../../context/AuthContexte';
import { v4 as uuidv4 } from 'uuid';

interface userInfoMpProps {
	channelUtility: ChannelUtility,
	mpChannel: string
}




const InfoMp: React.FC<userInfoMpProps> = ({ channelUtility, mpChannel}) => {
	const {socket, setInLobby, setLobbyData} = useAuth()
	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const[urlGame, setUrlGame] = useState<string>("")

	const query = useQuery();
	const roomUrl = query.get('room');
	const createUrl = query.get('create');
	const idOther = query.get('id');
	const mp = query.get('mp');

	let navigate = useNavigate();


	const handleStartGame = () => {
		if (!channelUtility.socket) return 
		if (socket && channelUtility && channelUtility.socket && channelUtility.me)
		{
			socket.once("server.lobby.state", (data: any) => {
				console.log("Un lobby est créé, voila les infos:");
				console.log(data)
				const theUrlGame = `http://localhost:3000/game?room=${data.lobbyId}`
				setInLobby(true);
				setLobbyData(data);
				const newMessage: Message = {
					message: `Un lobby a été préparé pour vous pour que vous puissez commencer une partie. Cliquez sur ce message !`,
					user: channelUtility.me as User,
					id: uuidv4(),
					timeSent: new Date(Date.now()).toLocaleString('en-US'),
					channelName: mpChannel,
					type: "mp",
					link: theUrlGame
				};
				if (channelUtility.socket)
				{
					channelUtility.socket.emit('chat', newMessage);
					setUrlGame(theUrlGame)
				}
				navigate("/game")
			});
			socket.emit("client.lobby.create", { mode: "vanilla" });
		}
	  };

  	return (
		<div className='channel-info channel-mp'>
			<h3>Mp avec  : {mpChannel}</h3>
			<button onClick={handleStartGame}>Start Game</button>
		</div>
  	);
};

export default InfoMp;


