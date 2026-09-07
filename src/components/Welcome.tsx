interface WelcomeProps {
  onSend: (text: string) => void;
}

const QUICK_QUESTIONS = [
  'Расскажи, что ты умеешь',
  'Как можно с тобой связаться?',
  'Помоги решить задачу',
  'Какие у тебя есть ограничения?',
];

export function Welcome({ onSend }: WelcomeProps) {
  return (
    <div className="welcome-block">
      <div className="chat-message message-ai">
        <div className="message-avatar">AI</div>
        <div className="message-content">
          <div className="message-text">
            Здравствуйте! Я ваш ИИ-ассистент. Задайте вопрос или выберите подсказку ниже.
          </div>
        </div>
      </div>
      <div className="welcome-questions">
        {QUICK_QUESTIONS.map((q) => (
          <button key={q} className="welcome-question" onClick={() => onSend(q)}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}