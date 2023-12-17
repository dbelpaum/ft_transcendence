import React, { useState, useEffect } from 'react';
import './Profil.css';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import EditableTextField from '../../components/EditableTextField/EditableTextField';
import { useAuth } from '../../context/AuthContexte';

interface UserInfo {
  pseudo: string;
  email: string;
  id: number;
  lastname: string;
  firstname: string;
  imageURL: string;
}

function Profil() {
  const { user } = useAuth();
  const userId = user?.id42;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
	console.log("le user id")
	console.log(userId)
    if (userId) {
      fetch(`http://localhost:4000/user/${userId}`)
        .then(response => response.json())
        .then(data => setUserInfo(data))
        .catch(error => console.log(error));
    }
  }, [userId]);

  const saveField = (field: keyof UserInfo, value: string) => {
    if (userId && userInfo) {
      const updatedUserInfo = { ...userInfo, [field]: value };
      setUserInfo(updatedUserInfo);
      
      fetch(`http://localhost:4000/user/${userId}/${field}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Field updated:', data);
      })
      .catch(error => {
        console.error('Error updating field:', error);
      });
    }
  };

  return (
    <main className="profil-container">
      <div className='decoBut'>
        <LogoutButton />
      </div>

      <div className="profil-details">
        {userInfo && (
          <>
            <div className="profil-image-container">
              <img src={userInfo.imageURL || 'default-profile.png'} alt="Profil" />
            </div>
            
            <EditableTextField
              label="Pseudo"
              value={userInfo.pseudo}
              onSave={(value) => saveField('pseudo', value)}
            />

            <EditableTextField
              label="Email"
              value={userInfo.email}
              onSave={(value) => saveField('email', value)}
            />

            <EditableTextField
              label="Prenom"
              value={userInfo.firstname}
              onSave={(value) => saveField('firstname', value)}
            />

            <EditableTextField
              label="Nom"
              value={userInfo.lastname}
              onSave={(value) => saveField('lastname', value)}
            />
            
          </>
        )}
      </div>
    </main>
  );
}

export default Profil;
