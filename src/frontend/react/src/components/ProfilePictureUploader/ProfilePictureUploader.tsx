import React, { useState } from 'react';

interface ProfilePictureUploaderProps {
    id42: number; // Identifiant de l'utilisateur
    onUploadSuccess: (imageUrl: string) => void; // Callback pour la mise à jour de l'image
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ id42, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const VALID_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            
            if (!VALID_FILE_TYPES.includes(selectedFile.type)) {
                alert('Veuillez sélectionner une image valide (JPEG, PNG, GIF).');
                return;
            }

            if (selectedFile.size > MAX_FILE_SIZE) {
                alert('La taille du fichier doit être inférieure à 5 MB.');
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            alert('Token non trouvé. Veuillez vous reconnecter.');
            return;
        }

        if (!file) {
            alert("Veuillez sélectionner une image.");
            return;
        }

        const uploadUrl = `http://localhost:4000/user/${id42}/image`; // Utiliser HTTPS
        const formData = new FormData();
        formData.append('image', file);
        formData.append('id42', id42.toString());

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
            onUploadSuccess(responseData.imageUrl);
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
            alert("Erreur lors du téléchargement de l'image. Veuillez réessayer.");
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

            onUploadSuccess(responseData.imageUrl);
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
        }
    }

    return (
        <div>
            <input type="file" accept="image/jpeg, image/png, image/gif" onChange={handleFileChange} />
            <button onClick={handleUpload}>Télécharger</button>
            <button onClick={handleDeleteFile}>Supprimer</button>
        </div>
    );
};

export default ProfilePictureUploader;
