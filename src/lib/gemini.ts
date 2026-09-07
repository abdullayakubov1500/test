import type { Message } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ?? 'gemini-3.6-flash';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const SUPPORT_PHONE = '+7 (900) 000-00-00';

const SYSTEM_PROMPT = [
  'Ты — ИИ-ассистент интернет-магазина товаров для автомобилей.',
  'Отвечай только на вопросы о товарах для автомобилей: запчастях, маслах, фильтрах, шинах, аксессуарах, инструменте, химии и аналогичных товарах.',
  'По таким вопросам помогай точно и по делу: подбирай товар, объясняй характеристики, совместимость и применение.',
  'Если вопрос не касается товаров для автомобилей (другая тематика, услуги, ремонт, гарантия и прочее) — вежливо объясни, что это вне зоны помощи, и перенаправь пользователя в автомастерскую по телефону ' + SUPPORT_PHONE + '.',
  'Отвечай на русском языке, кратко и без воды.',
  'Если не знаешь ответ про товар — честно скажи об этом и предложи уточнить модель автомобиля.',
].join(' ');

interface GenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

function isApiConfigured(): boolean {
  return Boolean(API_KEY);
}

export async function getAiResponse(history: Message[]): Promise<string> {
  if (!isApiConfigured()) {
    throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env');
  }

  const contents = history.map((m) => ({
    role: m.sender === 'ai' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));

  const response = await fetch(`${API_URL}/${MODEL}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Gemini request failed (${response.status}): ${errBody}`);
  }

  const data = (await response.json()) as GenerateContentResponse;
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim();

  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return text;
}