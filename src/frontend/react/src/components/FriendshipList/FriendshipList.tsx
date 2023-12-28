import React, { useState , useEffect} from 'react';
import './FriendshipList.css';
import { Link } from 'react-router-dom';



interface FriendshipListProps {
  userId: number;
}

export type User = {
    id: number;
    pseudo: string;
    firstname?: string;
    lastname?: string;
    imageURL?: string;
  };
  
  export type Friendship = {
    id: number;
    status: 'friend' | 'blocked';
    requester: User;
    addressee: User;
  };



const FriendshipList: React.FC<FriendshipListProps> = ({ userId }) => {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<Friendship[]>([]);
  const [showFriends, setShowFriends] = useState(false);
const [showBlockedUsers, setShowBlockedUsers] = useState(false);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token'); 
    fetch(`http://localhost:4000/friendship/${userId}/friends-and-blocked`,{
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
        },
    })
      .then(response => response.json())
      .then(data => {
        setFriends(data.friends);
        setBlockedUsers(data.blocked);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [userId]);

  return (
    <div>
  <div className="list-option" onClick={() => setShowFriends(!showFriends)}>
    Friends {showFriends ? '▲' : '▼'}
  </div>
  {showFriends && (
    <ul>
      {friends.map(friendship => (
        <li key={friendship.id}>
          <Link to={`/users/${friendship.addressee.pseudo}`}>
            {friendship.addressee.pseudo}
          </Link>
        </li>
      ))}
    </ul>
  )}

  <div className="list-option" onClick={() => setShowBlockedUsers(!showBlockedUsers)}>
    Blocked Users {showBlockedUsers ? '▲' : '▼'}
  </div>
  {showBlockedUsers && (
    <ul>
      {blockedUsers.map(blocked => (
        <li key={blocked.id}>
          <Link to={`/users/${blocked.addressee.pseudo}`}>
            {blocked.addressee.pseudo}
          </Link>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default FriendshipList;

