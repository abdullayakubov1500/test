import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../types';

const AI_RESPONSES = [
  'Здравствуйте! Я ИИ-ассистент. Чем могу помочь?',
  'Отличный вопрос! Давайте разберёмся вместе.',
  'Спасибо за обращение! Подготовлю ответ.',
  'Это хорошая тема. Расскажу подробнее.',
  'Понял вас. Могу предложить несколько вариантов решения.',
  'Благодарю за вопрос! С удовольствием помогу.',
];

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getRandomResponse(): string {
  return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: generateId(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const typingTimer = setTimeout(() => {
      const aiMessage: Message = {
        id: generateId(),
        text: getRandomResponse(),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500);

    timersRef.current.push(typingTimer);
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return { messages, isOpen, isTyping, hasOpened, sendMessage, openChat: () => { setIsOpen(true); setHasOpened(true); }, closeChat: () => setIsOpen(false) };
}