import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { Message as MessageComponent } from './Message';
import { ChatBackground } from './ChatBackground';
import { Welcome } from './Welcome';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onSend: (text: string) => void;
}

export function MessageList({ messages, isTyping, onSend }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="message-list">
      <ChatBackground />
      {messages.length === 0 && !isTyping && <Welcome onSend={onSend} />}
      {messages.map((msg) => (
        <MessageComponent key={msg.id} message={msg} />
      ))}
      {isTyping && (
        <div className="chat-message message-ai">
          <div className="message-avatar">AI</div>
          <div className="message-content">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}