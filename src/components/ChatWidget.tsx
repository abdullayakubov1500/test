interface ChatWidgetProps {
  onClick: () => void;
  pulse?: boolean;
}

export function ChatWidget({ onClick, pulse }: ChatWidgetProps) {
  return (
    <button className="chat-widget-button" onClick={onClick} aria-label="Открыть чат">
      {pulse && (
        <>
          <span className="ripple" aria-hidden="true"></span>
          <span className="ripple ripple-delay-1" aria-hidden="true"></span>
          <span className="ripple ripple-delay-2" aria-hidden="true"></span>
        </>
      )}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </button>
  );
}