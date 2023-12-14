import React, {useState, useEffect} from 'react';
import './Profil.css';
// import { useNavigate } from 'react-router-dom';
import Title from '../../components/Title/Title';
import { useAuth } from '../../context/AuthContexte';
import '../../components/LogoutButton/LogoutButton';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import { error } from 'console';
import EditableTextField from '../../components/EditableTextField/EditableTextField';

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
  const userId = user?.id;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:4000/user/${userId}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => setUserInfo(data))
        .catch(error => console.log(error));
    }
  }, [userId]);

  const handleFieldChange = (field: keyof UserInfo, value: string) => {
    if (userInfo) {
      setUserInfo({ ...userInfo, [field]: value });
      setIsEdited(true);
    }
  };

  const handleSave = () => {
    console.log("Saving changes:", userInfo);
    // Ici, ajoutez la logique pour sauvegarder les changements dans la base de données
    setIsEdited(false);
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
              onChange={(value) => handleFieldChange('pseudo', value)}
              onEdit={(edited) => setIsEdited(edited)}
              editable
            />

            <EditableTextField
              label="Email"
              value={userInfo.email}
              onChange={(value) => handleFieldChange('email', value)}
              onEdit={(edited) => setIsEdited(edited)}
              editable
            />

          </>
        )}
      </div>

      {isEdited && (
        <button onClick={handleSave} className="save-button">
          Sauvegarder les Changements
        </button>
      )}
    </main>
  );
}

export default Profil;
