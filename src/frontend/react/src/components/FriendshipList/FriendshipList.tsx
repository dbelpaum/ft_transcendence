import React, { useState , useEffect} from 'react';
import './FriendshipList.css';

type User = {
  id: number;
  name: string;
};

const FriendshipList: React.FC<{ userId: number }> = ({ userId }) => {
    const [showBlockedUsers, setShowBlockedUsers] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

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
    <div className="friendshipList-container">
      <div className="list-option" onClick={() => setShowBlockedUsers(!showBlockedUsers)}>
        Blocked Users {showBlockedUsers ? '▲' : '▼'}
      </div>
      {showBlockedUsers && (
        <ul>
          {blockedUsers.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}

      <div className="list-option" onClick={() => setShowFriends(!showFriends)}>
        Friends {showFriends ? '▲' : '▼'}
      </div>
      {showFriends && (
        <ul>
          {friends.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendshipList;
