import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatContainer({username, messages, setMessages}: any) {
    return (
        <div className='chat-box'>
            <MessageList username={username} messages={messages} />
            <MessageInput setMessages={setMessages} />


        </div>

    );
}

export default ChatContainer;