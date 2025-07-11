import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AIMessage } from '../../types';

vi.mock('../send_groq_review', () => ({
  sendGroqReview: vi.fn(async () => 'groq')
}));
vi.mock('../send_open_ai_review', () => ({
  sendOpenAiReview: vi.fn(async () => 'openai')
}));
vi.mock('../self_review', () => ({
  selfReview: vi.fn(async (_text: string) => 'self-reviewed')
}));

import { sendAiReview } from '../send_ai_review';
import { sendGroqReview } from '../send_groq_review';
import { sendOpenAiReview } from '../send_open_ai_review';
import { selfReview } from '../self_review';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('sendAiReview', () => {
  const baseParams = {
    file: 'file.ts',
    codeDiff: 'diff',
    prDescription: 'desc',
    repository: 'repo',
    prTitle: 'title'
  };

  it('uses Groq when configured', async () => {
    (global as any).chrome = {
      runtime: {
        sendMessage: vi.fn((_msg, cb) => cb({ success: true, data: { defaultGenerativeAiConnector: 'groq' } }))
      }
    };

    const result = await sendAiReview(baseParams);
    expect(sendGroqReview).toHaveBeenCalled();
    expect(sendOpenAiReview).not.toHaveBeenCalled();
    expect(selfReview).toHaveBeenCalledWith('groq', expect.any(Object));
    expect(result).toBe('self-reviewed');
  });

  it('uses OpenAI when configured', async () => {
    (global as any).chrome = {
      runtime: {
        sendMessage: vi.fn((_msg, cb) => cb({ success: true, data: { defaultGenerativeAiConnector: 'open-ai' } }))
      }
    };

    const result = await sendAiReview(baseParams);
    expect(sendOpenAiReview).toHaveBeenCalled();
    expect(sendGroqReview).not.toHaveBeenCalled();
    expect(selfReview).toHaveBeenCalledWith('openai', expect.any(Object));
    expect(result).toBe('self-reviewed');
  });

  it('forwards messages to provider', async () => {
    (global as any).chrome = {
      runtime: {
        sendMessage: vi.fn((_msg, cb) => cb({ success: true, data: { defaultGenerativeAiConnector: 'open-ai' } }))
      }
    };

    const msgs: AIMessage[] = [{ role: 'user', content: 'follow up' }];
    await sendAiReview({ ...baseParams, messages: msgs });
    expect(sendOpenAiReview).toHaveBeenCalledWith({ ...baseParams, messages: msgs });
    expect(selfReview).toHaveBeenCalled();
  });
});
