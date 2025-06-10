import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchGithubPRTitleAndDescription } from '../fetch_github_pr_description';

const baseVariables = { owner: 'o', repo: 'r', prNumber: 1 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('fetchGithubPRTitleAndDescription', () => {
  it('returns title and description when successful', async () => {
    (global as any).chrome = {
      runtime: {
        sendMessage: vi.fn((msg, cb) => cb({ success: true, data: { authToken: 'token' } }))
      }
    };
    (global as any).fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ data: { repository: { pullRequest: { body: 'body', title: 'title' } } } })
    })) as any;

    const result = await fetchGithubPRTitleAndDescription(baseVariables);
    expect(result).toEqual({ title: 'title', description: 'body' });
    expect((global.fetch as unknown as vi.Mock)).toHaveBeenCalled();
  });

  it('throws when token is missing', async () => {
    (global as any).chrome = {
      runtime: {
        sendMessage: vi.fn((msg, cb) => cb({ success: true, data: undefined }))
      }
    };

    await expect(fetchGithubPRTitleAndDescription(baseVariables)).rejects.toThrow('GitHub token not configured');
  });

  it('throws when response is not ok', async () => {
    (global as any).chrome = {
      runtime: {
        sendMessage: vi.fn((msg, cb) => cb({ success: true, data: { authToken: 'token' } }))
      }
    };
    (global as any).fetch = vi.fn(async () => ({ ok: false, statusText: 'Bad Request' })) as any;

    await expect(fetchGithubPRTitleAndDescription(baseVariables)).rejects.toThrow('HTTP error! status: Bad Request');
  });
});
