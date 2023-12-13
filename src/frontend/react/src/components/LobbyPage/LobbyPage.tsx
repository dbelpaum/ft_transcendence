// LobbyPage.tsx
import React, { useEffect, useState } from 'react';

interface LobbyPageProps {
  roomId: string;
  socket: any;
  initialLobbyState: any;
}

const LobbyPage: React.FC<LobbyPageProps> = ({ roomId, socket, initialLobbyState }) => {
  const [lobbyState, setLobbyState] = useState<any>(initialLobbyState);

  useEffect(() => {
    if (socket) {
      socket.on('server.lobby.state', (data: any) => {
        console.log('Received Lobby State:', data);
        setLobbyState(data);
      });
    }

    return () => {
      if (socket) {
        socket.off('server.lobby.state');
      }
    };
  }, [socket]);

  return (
    <div>
      <h2>Lobby: {roomId}</h2>
      {lobbyState && (
        <div>
          <p>Has Started: {lobbyState.hasStarted ? 'Yes' : 'No'}</p>
          <p>Has Finished: {lobbyState.hasFinished ? 'Yes' : 'No'}</p>
          <p>Is Suspended: {lobbyState.isSuspended ? 'Yes' : 'No'}</p>
          <p>Players Count: {lobbyState.playersCount}</p>
          <p>Scores:</p>
          <ul>
            {lobbyState.scores &&
              Object.entries(lobbyState.scores).map(([playerId, score]) => (
                <li key={playerId}>{`Player ${playerId}: ${score}`}</li>
              ))}
          </ul>
        </div>
      )}
      <div style={{ display: 'flex' }}>
        {/* Left side: Current user */}
        <div style={{ flex: 1 }}>
          <h3>Your Information</h3>
          {lobbyState?.players &&
            lobbyState.players.map((player: any) => (
              <div key={player.id}>{player.name}</div>
            ))}
        </div>

        {/* Right side: Opponent(s) */}
        <div style={{ flex: 1 }}>
          <h3>Opponent(s) Information</h3>
          {lobbyState?.players &&
            lobbyState.players.map((player: any) => (
              <div key={player.id}>{player.name}</div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
