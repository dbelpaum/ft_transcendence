import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatContainer({username, messages, setMessages, socket}: any) {
    return (
        <div className='chat-box'>
            <MessageList messages={messages} />
            <MessageInput setMessages={setMessages} messages={messages} socket={socket}/>
        </div>

    );
}

export default ChatContainer;