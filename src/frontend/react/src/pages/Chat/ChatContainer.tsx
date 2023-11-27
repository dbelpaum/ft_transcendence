import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatContainer({messages, setMessages}: any) {
    return (
        <div className='chat-box'>
            <MessageList messages={messages} />
            <MessageInput setMessages={setMessages} />


        </div>

    );
}

export default ChatContainer;