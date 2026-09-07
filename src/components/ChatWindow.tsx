import { Header } from './Header';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
}

export function ChatWindow({ messages, isTyping, onSend, onClose }: ChatWindowProps) {
  return (
    <div className="chat-window">
      <Header onClose={onClose} />
      <MessageList messages={messages} isTyping={isTyping} onSend={onSend} />
      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
}