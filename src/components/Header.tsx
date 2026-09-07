interface HeaderProps {
  onClose: () => void;
}

export function Header({ onClose }: HeaderProps) {
  return (
    <div className="chat-header">
      <div className="header-avatar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="9.2" r="3.1" />
          <path d="M5.6 20c.8-3.2 3.3-5.1 6.4-5.1s5.6 1.9 6.4 5.1" />
          <path d="M6.4 10.4V8.6a5.6 5.6 0 0 1 11.2 0v1.8" />
          <rect x="5.1" y="9.4" width="2.6" height="4.1" rx="1.3" fill="currentColor" stroke="none" />
          <rect x="16.3" y="9.4" width="2.6" height="4.1" rx="1.3" fill="currentColor" stroke="none" />
          <path d="M7.7 13.4v2.5a1.8 1.8 0 0 0 1.4 1.75" />
        </svg>
      </div>
      <div className="header-info">
        <div className="header-title">AI-ассистент</div>
        <div className="header-status"><span className="status-dot"></span> Онлайн</div>
      </div>
      <button className="header-close" onClick={onClose} aria-label="Закрыть чат">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}