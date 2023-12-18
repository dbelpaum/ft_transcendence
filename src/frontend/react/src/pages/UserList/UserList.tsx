import React, { useState, useEffect } from 'react';
import './UserList.css';
import UserProfile from '../UserProfil/UserProfil';

interface User {
    id42: number;
    pseudo: string;
    email: string;
    imageURL: string;
    // Ajoutez d'autres champs selon la structure de vos données utilisateur
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch('http://localhost:4000/user/GetAllUsers') 
            .then(response => response.json())
            .then((data: User[]) => setUsers(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="user-list">
            {users.map(user => (
                <div key={user.id42} className="user-item">
                    <img src={user.imageURL} alt="Profile" className="profile-pic" />
                    <h3><a href={`/user/${user.id42}`}>{user.pseudo}</a></h3>  {/* Remplacer par composant react */}
                    <p>{user.email}</p>
                    
                    {/* Autres détails de l'utilisateur */}
                </div>
            ))}
        </div>
    );
};

export default UserList;
