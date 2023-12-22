import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./UserProfil.css";
import { useAuth } from "../../context/AuthContexte";
import { Link } from "react-router-dom";
import FriendshipButton from "../../components/FriendshipButton/FriendshipButton";

interface UserInfo {
    id42: number;
    pseudo: string;
    email: string;
    isFriend: boolean;
    imageURL: string;
    firstname: string;
    lastname: string;
    bio: string;
    createdAt: string;
}

interface UserProfileProps {
    pseudo: string;
}

const UserProfile: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isFriend, setIsFriend] = useState<boolean | null>(null);
    const { user } = useAuth();
    const { pseudo } = useParams<{ pseudo: string }>();

    useEffect(() => {
        if (!pseudo) {
            console.log("Aucun pseudo utilisateur fourni");
            return;
        }

        // console.log(`Le pseudo de l'utilisateur cible est: ${pseudo}`);
        // console.log(`L'utilisateur connecté est: ${user?.pseudo}`)

        
        fetch(`http://localhost:4000/user/by-pseudo/${pseudo}`)
            .then(response => response.json())
            .then((data: UserInfo) => {
                setUserInfo(data);
                setIsFriend(data.isFriend);
            })
            .catch(error => console.log(error));

    }, [pseudo]);


useEffect(() => {
    if (!user?.id42 || !userInfo?.id42) {
        return;
    }
    fetch(`http://localhost:4000/friendship/${user?.id42}/relation/${userInfo?.id42}`)
        .then(response => response.json())
        .then((data: boolean) => {
            setIsFriend(data);
        })
        .catch(error => console.log(error));
     }, [user?.id42, userInfo?.id42]);

    console.log(isFriend)


    if (!userInfo) {
        return <div>Chargement...</div>;
    }

    return (
      <main className="user-profile-container">
          <div className="profile-header">
              <img src={userInfo.imageURL} alt={userInfo.pseudo} className="profile-pic"/>
              <h1>{userInfo.firstname} {userInfo.lastname}</h1>
              <p className="user-email">{userInfo.email}</p>
              <p className="user-bio">{userInfo.bio}</p>
          </div>
          <div className="profile-details">
              <h2>À propos de moi</h2>
              <p>Pseudo: {userInfo.pseudo}</p>
              <p>Membre depuis: {new Date(userInfo.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="friend-action">
          {isFriend ===false && (
            <FriendshipButton
                status="addFriend"
                onButtonClick={() =>console.log("click")}
                color="green"
            />
          )}
            {isFriend ===true && (
                <FriendshipButton
                    status="removeFriend"
                    onButtonClick={() =>console.log("click")}
                    color="red"
                />
            )}
          </div>
      </main>
  );
};

export default UserProfile;