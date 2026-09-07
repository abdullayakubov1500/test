import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { getAiResponse } from '../lib/api';

const FALLBACK_RESPONSES = [
  'Здравствуйте! Я ИИ-ассистент. Чем могу помочь?',
  'Отличный вопрос! Давайте разберёмся вместе.',
  'Спасибо за обращение! Подготовлю ответ.',
  'Это хорошая тема. Расскажу подробнее.',
  'Понял вас. Могу предложить несколько вариантов решения.',
  'Благодарю за вопрос! С удовольствием помогу.',
];

const TYPING_MIN_DELAY = 700;

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getFallbackResponse(): string {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesRef = useRef<Message[]>([]);
  const aliveRef = useRef(true);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const sendMessage = useCallback(async (text: string) => {
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

    const startedAt = Date.now();
    let reply: string;

    try {
      reply = await getAiResponse([...messagesRef.current, userMessage]);
    } catch (error) {
      console.error('AI request failed, using fallback:', error);
      reply = getFallbackResponse();
    }

    const elapsed = Date.now() - startedAt;
    const remaining = TYPING_MIN_DELAY - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }

    if (!aliveRef.current) return;

    const aiMessage: Message = {
      id: generateId(),
      text: reply,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  }, []);

  return {
    messages,
    isOpen,
    isTyping,
    hasOpened,
    sendMessage,
    openChat: () => {
      setIsOpen(true);
      setHasOpened(true);
    },
    closeChat: () => setIsOpen(false),
  };
}