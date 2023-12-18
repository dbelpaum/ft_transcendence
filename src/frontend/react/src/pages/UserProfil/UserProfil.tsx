import React from "react";
import { useState  , useEffect} from "react";
import "./UserProfil.css";
import EditableTextField from "../../components/EditableTextField/EditableTextField";

interface UserInfo {
    pseudo: string;
    email: string;
    isFriend: boolean;
    // Ajoutez d'autres champs selon la structure de vos données utilisateur
  }
  
  interface UserProfileProps {
    userId: string;
  }

  
  const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isFriend, setIsFriend] = useState<boolean>(false);
  
    useEffect(() => {
      if (!userId) {
        console.log("Aucun ID utilisateur fourni");
        return;
      }
  
      fetch(`http://localhost:4000/${userId}`)
        .then(response => response.json())
        .then((data: UserInfo) => {
          setUserInfo(data);
          setIsFriend(data.isFriend); // Assurez-vous que 'isFriend' est un champ dans 'UserInfo'
        })
        .catch(error => console.log(error));
    }, [userId]);
  
    if (!userInfo) {
      return <div>Chargement...</div>;
    }
  
    return (
      <main className="user-profile-container">
        <h1>Profil de {userInfo.pseudo}</h1>
        <p>Email: {userInfo.email}</p>
        {/* ... autres détails ... */}
        {isFriend ? (
          <p>Vous êtes déjà amis.</p>
        ) : (
          <button>Ajouter comme ami</button>
        )}
      </main>
    );
  };
  
  export default UserProfile;