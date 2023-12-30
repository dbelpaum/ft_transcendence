import React, { useState , useEffect} from 'react';
import DefaultProfilePic from '../../assets/default-profile.png';
import ProfilePictureUploader from '../ProfilePictureUploader/ProfilePictureUploader';

interface ProfilePictureProps {
    id42: number; // Identifiant du utilisateur
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ id42 }) => {
    const [isUploaderVisible, setUploaderVisible] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('');

    useEffect(() => {
        if (id42) {
            fetch(`http://localhost:4000/user/${id42}/image`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur réseau: ${response.status}`);
                    }
                    return response.text();
                })
                .then(imageUrl => {
                   
                        setProfilePicUrl(imageUrl);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération de l\'image:', error);
                });
        }
    }, [id42]);
    
    
    const handleUploadSuccess = (newImageUrl: string) => {
        setUploaderVisible(false);
        // setProfilePicUrl(newImageUrl);
    };
    console.log('Profil url:' + profilePicUrl);

    const handleClick = () => {
        if (isUploaderVisible === true) {
            setUploaderVisible(false);
            return;
        }
        setUploaderVisible(true);
    };


    return (
        <div>
            <img
                src={ profilePicUrl ||DefaultProfilePic}
                alt="Profile"
                style={{ cursor: 'pointer', width: '100px', height: '100px' }}
                onClick={handleClick}
            />
            {isUploaderVisible && <ProfilePictureUploader id42={id42} onUploadSuccess={handleUploadSuccess} />}
        </div>
    );
};

export default ProfilePicture;
