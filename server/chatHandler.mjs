import { getGeminiReply } from './gemini.mjs';

export async function handleChat(body) {
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { status: 400, json: { error: 'messages array is required' } };
  }

  for (const m of messages) {
    if (!m || typeof m.text !== 'string' || (m.role !== 'user' && m.role !== 'model')) {
      return { status: 400, json: { error: 'invalid message shape' } };
    }
  }

  try {
    const reply = await getGeminiReply(messages);
    return { status: 200, json: { reply } };
  } catch (error) {
    console.error('Chat API error:', error);
    return {
      status: 500,
      json: { error: error instanceof Error ? error.message : 'Internal server error' },
    };
  }
}