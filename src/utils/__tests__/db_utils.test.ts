import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { GenerativeAiSettings } from '../../types';

const generativeAiSettingsStore: { data?: any } = {};
const githubSettingsStore: { data?: any } = {};

vi.mock('../../db', () => ({
  db: {
    generativeAiSettings: {
      put: vi.fn(async (val) => { generativeAiSettingsStore.data = val; }),
      get: vi.fn(async () => generativeAiSettingsStore.data)
    },
    githubSettings: {
      put: vi.fn(async (val) => { githubSettingsStore.data = val; }),
      get: vi.fn(async () => githubSettingsStore.data)
    }
  }
}));

import {
  saveGenerativeAiSettings,
  getGenerativeAiSettings,
  saveGithubAuthToken,
  getGithubAuthToken
} from '../db_utils';

beforeEach(() => {
  generativeAiSettingsStore.data = undefined;
  githubSettingsStore.data = undefined;
});

describe('db_utils', () => {
  it('saves and retrieves generative AI settings', async () => {
    const settings: GenerativeAiSettings = {
      id: 'default',
      openAiApiKey: 'key',
      groqApiKey: '',
      openAiEndpoint: '',
      groqEndpoint: '',
      defaultOpenAiModel: 'model',
      defaultGroqModel: 'groq',
      customPrompt: 'p',
      customPromptRole: 'role',
      defaultGenerativeAiConnector: 'open-ai'
    };
    await saveGenerativeAiSettings(settings);
    const result = await getGenerativeAiSettings();
    expect(result).toEqual(settings);
  });

  it('saves and retrieves github auth token', async () => {
    await saveGithubAuthToken('token');
    const result = await getGithubAuthToken();
    expect(result).toEqual({ id: 'default', authToken: 'token' });
  });
});
