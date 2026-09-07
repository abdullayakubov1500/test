import type { Message } from '../types';

interface MessageProps {
  message: Message;
}

export function Message({ message }: MessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`chat-message ${isUser ? 'message-user' : 'message-ai'}`}>
      {!isUser && (
        <div className="message-avatar">AI</div>
      )}
      <div className="message-content">
        <div className="message-text">{message.text}</div>
        <div className="message-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}