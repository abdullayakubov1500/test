import { useChat } from './hooks/useChat';
import { ChatWidget } from './components/ChatWidget';
import { ChatWindow } from './components/ChatWindow';
import './App.css';

function App() {
  const { messages, isOpen, isTyping, hasOpened, sendMessage, closeChat, openChat } = useChat();

  return (
    <div className="app">
      {isOpen ? (
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          onSend={sendMessage}
          onClose={closeChat}
        />
      ) : (
        <ChatWidget onClick={openChat} pulse={!hasOpened} />
      )}
    </div>
  );
}

export default App;