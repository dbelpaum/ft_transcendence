import React, { useState , useEffect} from 'react';
import ProfilePictureUploader from '../ProfilePictureUploader/ProfilePictureUploader';

interface ProfilePictureProps {
    id42: number; // Identifiant du utilisateur
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ id42 }) => {
    const [isUploaderVisible, setUploaderVisible] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('default-profile.png');
    // URL de l'image de profil actuelle
    useEffect(() => {
        if (id42) {
            fetch(`http://localhost:4000/user/${id42}/image`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur réseau: ${response.status}`);
                    }
                    return response.text(); // Utiliser text() au lieu de json()
                })
                .then(imageUrl => {
                    setProfilePicUrl(imageUrl);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération de l\'image:', error);
                });
        }
    }, [id42]);
    
    console.log('Profil url:' + profilePicUrl);

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
                src={profilePicUrl || 'default-profile.png'}
                alt="Profile"
                style={{ cursor: 'pointer', width: '100px', height: '100px' }}
                onClick={handleClick}
            />
            {isUploaderVisible && <ProfilePictureUploader id42={id42} onUploadSuccess={handleUploadSuccess} />}
        </div>
    );
};

export default ProfilePicture;