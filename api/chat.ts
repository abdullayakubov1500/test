import { handleChat } from '../server/chatHandler.mjs';
import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let raw = '';
  for await (const chunk of req) raw += chunk;

  let body: unknown;
  try {
    body = JSON.parse(raw || '{}');
  } catch {
    body = {};
  }

  const result = await handleChat(body);
  res.statusCode = result.status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result.json));
}