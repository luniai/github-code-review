import { describe, it, expect } from 'vitest';
import { parseHtmlToGitDiff } from '../parse_git_diff';

const diffHtml = `
<table><tbody>
<tr><td class="blob-code-hunk">@@ -1,2 +1,2 @@</td></tr>
<tr><td class="blob-code-deletion">old line</td></tr>
<tr><td class="blob-code-addition">new line</td></tr>
</tbody></table>`;

describe('parseHtmlToGitDiff', () => {
  it('converts HTML diff to unified diff format', () => {
    const result = parseHtmlToGitDiff(diffHtml);
    expect(result).toBe('@@ -1,2 +1,2 @@\n-old line\n+new line');
  });
});
