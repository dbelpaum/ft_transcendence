import React, { useState, useEffect } from 'react';
import './UserList.css';

interface User {
    id42: number;
    name: string;
    email: string;
    // Ajoutez d'autres champs selon la structure de vos données utilisateur
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch('http://localhost:4000/user/GetAllUsers') // Remplacez par l'URL de votre API
            .then(response => response.json())
            .then((data: User[]) => setUsers(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="user-list">
            {users.map(user => (
                <div key={user.id42} className="user-item">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    {/* Autres détails de l'utilisateur */}
                </div>
            ))}
        </div>
    );
};

export default UserList;
