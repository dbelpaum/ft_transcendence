import React, { useState } from 'react';
import ProfilePictureUploader from '../ProfilePictureUploader/ProfilePictureUploader';

const ProfilePicture: React.FC = () => {
    const [isUploaderVisible, setUploaderVisible] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('URL_IMAGE_PAR_DEFAUT'); // URL de l'image de profil actuelle

    const handleUploadSuccess = (newImageUrl: string) => {
        setProfilePicUrl(newImageUrl); // Met à jour l'URL de l'image de profil
        setUploaderVisible(false); // Ferme l'uploader
    };

    const handleClick = () => {
        setUploaderVisible(true);
    };

    return (
        <div>
            <img
                src={profilePicUrl}
                alt="Profile"
                style={{ cursor: 'pointer', width: '100px', height: '100px' }}
                onClick={handleClick}
            />
            {isUploaderVisible && <ProfilePictureUploader onUploadSuccess={handleUploadSuccess} />}
        </div>
    );
};

export default ProfilePicture;
