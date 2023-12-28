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

interface userInfoMpProps {
	channelUtility: ChannelUtility,
	mpChannel: string
}




const InfoMp: React.FC<userInfoMpProps> = ({ channelUtility, mpChannel}) => {
	const socket = useContext(SocketContext) as unknown as Socket;
	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const roomUrl = query.get('room');
	const createUrl = query.get('create');
	const idOther = query.get('id');
	const mp = query.get('mp');


	const handleStartGame = () => {
		if (socket)
		{
			window.open("http://localhost:3000/game?create=true", "_blank");
	
			socket.on("server.lobby.state", (data: any) => {
				console.log("Un lobby est créé, voila les infos:");
				console.log(data)
			});
		}
	  };

  	return (
		<div className='channel-info'>
			<h3>Mp avec  : {mpChannel}</h3>
			<button onClick={handleStartGame}>Start Game</button>
		</div>
  	);
};

export default InfoMp;


