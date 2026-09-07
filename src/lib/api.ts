import type { Message } from '../types';

export async function getAiResponse(history: Message[]): Promise<string> {
  const messages = history.map((m) => ({
    role: m.sender === 'ai' ? 'model' : 'user',
    text: m.text,
  }));

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    let message = `Chat API failed (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data?.error === 'string' && data.error) {
        message = data.error;
      }
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { reply?: unknown };
  if (typeof data.reply !== 'string' || !data.reply.trim()) {
    throw new Error('Chat API returned an empty reply');
  }
  return data.reply;
}