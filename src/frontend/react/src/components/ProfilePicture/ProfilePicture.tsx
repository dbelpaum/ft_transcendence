import React, { useState } from 'react';
import ProfilePictureUploader from '../ProfilePictureUploader/ProfilePictureUploader';

interface ProfilePictureProps {
    id42: string; // Identifiant du utilisateur
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ id42 }) => {
    const [isUploaderVisible, setUploaderVisible] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('URL_IMAGE_PAR_DEFAUT'); // URL de l'image de profil actuelle

    const handleUploadSuccess = (newImageUrl: string) => {
        setProfilePicUrl(newImageUrl);
        setUploaderVisible(false);
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
            {isUploaderVisible && <ProfilePictureUploader id42={id42} onUploadSuccess={handleUploadSuccess} />}
        </div>
    );
};

export default ProfilePicture;
