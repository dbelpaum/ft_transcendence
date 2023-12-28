import React, { useState , useEffect} from 'react';
import './FriendshipList.css';


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
    fetch(`http://localhost:4000/friendship/${userId}/friends-and-blocked`)
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
          {friendship.addressee.pseudo}
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
          {blocked.addressee.pseudo}
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default FriendshipList;

