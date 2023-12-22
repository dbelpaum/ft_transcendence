import React, { useState, useEffect, useRef } from 'react';
import {
	Channel,
  ChannelUtility,
	Message,
	addAdminInfo,
  } from '../chat.interface';
import { User } from '../../../context/AuthInteface';
import crownIconPath from '../assets/couronne.svg';

interface UserAndAdmin {
	user: User;
	isAdmin: boolean;
	isOwner: boolean;
}

interface userInfoProps {
	channelUtility: ChannelUtility;
	userAndAdmin: UserAndAdmin;
	channelUrl: string|null;
	iAmAdmin: boolean;
	currentChannel: Channel
}

const UserInfo: React.FC<userInfoProps> = ({ channelUtility, userAndAdmin, channelUrl, iAmAdmin, currentChannel}) => {
	const [showModal, setShowModal] = useState(false);
	const modalRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
        // Attacher l'écouteur d'événement
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Nettoyer l'écouteur d'événement
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
	
	if (!channelUtility.me) return null
	const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setShowModal(false);
        }
    };

	const handleAdminClick = () => {
		if (channelUrl && channelUtility && channelUtility.me && channelUtility.socket)
		{
			const adminInfo : addAdminInfo =
			{
				channel: channelUrl,
				user_to_modify: userAndAdmin.user,
				user: channelUtility.me,
			}
			channelUtility.socket.emit('add_admin', adminInfo);
            setShowModal(false);
			channelUtility.recharger()

		}
	}

	const handleRemoveAdminClick = () => {
		if (channelUrl && channelUtility && channelUtility.me && channelUtility.socket)
		{
			const adminInfo : addAdminInfo =
			{
				channel: channelUrl,
				user_to_modify: userAndAdmin.user,
				user: channelUtility.me,
			}
			channelUtility.socket.emit('remove_admin', adminInfo);
            setShowModal(false);
			channelUtility.recharger()

		}
	}

	const handleKickClick = () => {
		if (channelUrl && channelUtility && channelUtility.me && channelUtility.socket)
		{
			const kickInfo : addAdminInfo =
			{
				channel: channelUrl,
				user_to_modify: userAndAdmin.user,
				user: channelUtility.me,
			}
			channelUtility.socket.emit('kick', kickInfo);
            setShowModal(false);
			channelUtility.recharger()

		}
	}

	const handleBanClick = () => {
		if (channelUrl && channelUtility && channelUtility.me && channelUtility.socket)
		{
			const banInfo : addAdminInfo =
			{
				channel: channelUrl,
				user_to_modify: userAndAdmin.user,
				user: channelUtility.me,
			}
			channelUtility.socket.emit('ban', banInfo);
            setShowModal(false);
			channelUtility.recharger()

		}
	}

	const handleMuteClick = () => {
		if (channelUrl && channelUtility && channelUtility.me && channelUtility.socket)
		{
			const muteInfo : addAdminInfo =
			{
				channel: channelUrl,
				user_to_modify: userAndAdmin.user,
				user: channelUtility.me,
			}
			channelUtility.socket.emit('mute', muteInfo);
            setShowModal(false);
			channelUtility.recharger()

		}
	}




  return (
        <div className='userChannel'>
			
			<span><img src={crownIconPath} alt="Couronne" className={`crownIcon ${userAndAdmin.isAdmin ? 'appear' : ''}`} /></span>
			<a href={`http://localhost:3000/users/${userAndAdmin.user.pseudo}`} target="_blank" rel="noopener noreferrer">
				<span 
					title={userAndAdmin.isOwner ? "owner" : ""}
					className={userAndAdmin.isOwner ? "profil owner" : "profil"}>
					{userAndAdmin.user.pseudo}
				</span>
			</a>
			<div className="container_button">
			{(iAmAdmin 
				&& (channelUtility.me.pseudo !== userAndAdmin.user.pseudo)) 
				&& (!userAndAdmin.isOwner) 
				&& (
				<button className="action-button" onClick={toggleModal}>Actions</button>
			)}
				{showModal && (
					<div className="modal" ref={modalRef}>
						<span onClick={handleKickClick}>Kick</span>
						<span onClick={handleBanClick}>Ban</span>
						<span onClick={handleMuteClick}>Mute</span>
						{
							(!userAndAdmin.isAdmin) ? 
							(<span onClick={handleAdminClick}>Make Admin</span>) : 
							(<span onClick={handleRemoveAdminClick}>Remove Admin</span>)
						}
					</div>
				)}
			</div>
			
        </div>
  );
};

export default UserInfo;