import React, { useState } from 'react';

interface ProfilePictureUploaderProps {
    id42: number; // Identifiant de l'utilisateur
    onUploadSuccess: (imageUrl: string) => void; // Callback pour la mise à jour de l'image
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ id42, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };



    const handleUpload = async () => {
        const jwtToken = localStorage.getItem('token');
        if (!file) {
            alert("Veuillez sélectionner une image.");
            return;
        }
    const uploadUrl = `http://localhost:4000/user/${id42}/image`;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('id42', id42.toString()); // Ajout de l'identifiant de l'utilisateur

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);

            // Supposons que responseData contient l'URL de la nouvelle image de profil
            onUploadSuccess(responseData.imageUrl);
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
        }
    };

    const handleDeleteFile = async () => {
        const jwtToken = localStorage.getItem('token');
        const uploadUrl = `http://localhost:4000/user/${id42}/image`;
        const formData = new FormData();
        formData.append('id42', id42.toString()); // Ajout de l'identifiant de l'utilisateur

        try {
            const response = await fetch(uploadUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);

            // Supposons que responseData contient l'URL de la nouvelle image de profil
            onUploadSuccess(responseData.imageUrl);
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Télécharger</button>
            <button onClick={handleDeleteFile}>Supprimer</button>
        </div>
    );
};

export default ProfilePictureUploader;
