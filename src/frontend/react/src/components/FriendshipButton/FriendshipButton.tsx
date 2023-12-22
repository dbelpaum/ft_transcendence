import React from "react"
import './FriendshipButton.css'


type FriendshipButtonProps = {
    status: 'addFriend' | 'removeFriend' | 'block' | 'cancelRequest';
    onButtonClick: () => void;
    color?: string;
};

const FriendshipButton: React.FC<FriendshipButtonProps> = ({ status, onButtonClick, color }) => {
    let buttonText = '';
    switch (status) {
        case 'addFriend':
            buttonText = 'Ajouter en ami';
            break;
        case 'removeFriend':
            buttonText = 'Supprimer l\'ami';
            break;
        case 'block':
            buttonText = 'Bloquer';
            break;
        case 'cancelRequest':
            buttonText = 'Annuler la demande d\'ami';
            break;
        default:
            buttonText = 'Action';
    }

    const buttonStyle = {
        backgroundColor: color || 'blue', // Couleur par défaut
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    return (
        <button style={buttonStyle} onClick={onButtonClick}>
            {buttonText}
        </button>
    );
};

export default FriendshipButton;
