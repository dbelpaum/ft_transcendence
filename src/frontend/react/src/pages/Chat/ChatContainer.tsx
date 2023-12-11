import React from 'react';
import MessageInput from './MessageInput';

function ChatContainer({username, messages, setMessages, socket}: any) {
    return (
        <div className='chat-box'>
            <MessageInput setMessages={setMessages} messages={messages} socket={socket}/>
        </div>

    );
}

export default ChatContainer;