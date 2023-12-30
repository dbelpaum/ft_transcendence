import React, { useState, useEffect } from 'react';
import './UserList.css';
import DefaultProfilPicture from '../../assets/default-profile.png';
import UserProfile from '../UserProfil/UserProfil';
import { User } from '../../context/AuthInteface';



const UserList: React.FC = () => {
    const [users, setUsersList] = useState<User[]>([]);

    useEffect(() => {
        fetch('http://localhost:4000/user/GetAllUsers') 
            .then(response => response.json())
            .then((data: User[]) => setUsersList(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="user-list">
            {users.map(user => (
                <div key={user.id42} className="user-item">
                    <img src={user.imageURL || DefaultProfilPicture} alt="Profile" className="profile-pic" />
                    <h3><a href={`/users/${user.pseudo}`}>{user.pseudo}</a></h3>
                    <p>{user.email}</p>
                    
                </div>
            ))}
        </div>
    );
};

export default UserList;
