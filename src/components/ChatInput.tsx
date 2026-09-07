import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTextRef = useRef('');
  const [supported] = useState(
    () => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  const [micAvailable, setMicAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkMic = async () => {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!cancelled) {
          setMicAvailable(devices.some((d) => d.kind === 'audioinput'));
        }
      } catch {
        if (!cancelled) {
          setMicAvailable(false);
        }
      }
    };
    checkMic();
    return () => {
      cancelled = true;
    };
  }, []);

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) {
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.stop();
      } catch {
        /* noop */
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    finalTextRef.current = '';
  };

  const startListening = () => {
    if (!supported || !micAvailable || disabled) return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = 'ru-RU';
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (ev) => {
      let interim = '';
      for (let i = 0; i < ev.results.length; i++) {
        const result = ev.results[i];
        if (result.isFinal) {
          finalTextRef.current += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      setText(finalTextRef.current + interim);
    };

    const finish = () => {
      recognitionRef.current = null;
      setIsListening(false);
      finalTextRef.current = '';
    };

    rec.onend = finish;
    rec.onerror = (ev) => {
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
        setMicAvailable(false);
      }
      finish();
    };

    recognitionRef.current = rec;
    setIsListening(true);
    finalTextRef.current = '';
    try {
      rec.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    if (isListening) stopListening();
    onSend(text);
    setText('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите сообщение..."
        disabled={disabled}
        autoFocus
      />
      {supported && (
        <button
          type="button"
          className={`mic-button${isListening ? ' mic-button-active' : ''}`}
          onClick={toggleListening}
          disabled={disabled || !micAvailable}
          aria-label={isListening ? 'Остановить голосовой ввод' : 'Голосовой ввод'}
          title={!micAvailable ? 'Микрофон недоступен' : isListening ? 'Остановить' : 'Голосовой ввод'}
        >
          {isListening ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </button>
      )}
      <button type="submit" disabled={disabled || !text.trim()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
}