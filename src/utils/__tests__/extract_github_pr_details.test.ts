import { describe, it, expect } from 'vitest';
import { extractGitHubPRDetails } from '../extract_github_pr_details';

describe('extractGitHubPRDetails', () => {
  it('parses a valid GitHub PR URL', () => {
    const url = 'https://github.com/foo/bar/pull/123';
    const result = extractGitHubPRDetails(url);
    expect(result).toEqual({ owner: 'foo', repo: 'bar', prNumber: 123 });
  });

  it('throws on an invalid GitHub PR URL', () => {
    const url = 'https://github.com/foo/bar/issues/123';
    expect(() => extractGitHubPRDetails(url)).toThrowError('Invalid GitHub PR URL');
  });
});
