import React, { useState, useEffect, useRef } from 'react';
import {
  ChannelUtility,
	Message,
	addAdminInfo,
  } from './chat.interface';
import { User } from '../../context/AuthInteface';
import crownIconPath from './couronne.svg';

interface UserAndAdmin {
	user: User;
	isAdmin: boolean;
	isOwner: boolean;
}

interface userInfoProps {
  channelUtility: ChannelUtility;
  userAndAdmin: UserAndAdmin;
	channelUrl: string|null;
}

const UserInfo: React.FC<userInfoProps> = ({ channelUtility, userAndAdmin, channelUrl }) => {
	const [showModal, setShowModal] = useState(false);
	const modalRef = useRef<HTMLDivElement | null>(null)

	const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setShowModal(false);
        }
    };

	const handleAdminClick = () => {
		if (channelUrl && channelUtility && channelUtility.me)
		{
			const adminInfo : addAdminInfo =
			{
				channel: channelUrl,
				new_admin_name: userAndAdmin.user.pseudo,
				user: channelUtility.me,
			}
			channelUtility.socket.emit('add_admin', adminInfo);
            setShowModal(false);

		}
	}

	const handleRemoveAdminClick = () => {
		if (channelUrl && channelUtility && channelUtility.me)
		{
			const adminInfo : addAdminInfo =
			{
				channel: channelUrl,
				new_admin_name: userAndAdmin.user.pseudo,
				user: channelUtility.me,
			}
			channelUtility.socket.emit('remove_admin', adminInfo);
            setShowModal(false);

		}
	}

	useEffect(() => {
        // Attacher l'écouteur d'événement
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Nettoyer l'écouteur d'événement
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


  return (
        <div className='userChannel'>
			
			<span><img src={crownIconPath} alt="Couronne" className={`crownIcon ${userAndAdmin.isAdmin ? 'appear' : ''}`} /></span>
          	<span 
				title={userAndAdmin.isOwner ? "owner" : ""}
				className={userAndAdmin.isOwner ? "owner" : ""}>
				{userAndAdmin.user.pseudo}
			</span>
			<div className="container_button">
				<button className="action-button" onClick={toggleModal}>Actions</button>
				{showModal && (
					<div className="modal" ref={modalRef}>
						<span>Kick</span>
						<span>Ban</span>
						<span>Mute</span>
						{
							!userAndAdmin.isAdmin ? 
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