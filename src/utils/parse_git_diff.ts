export function parseHtmlToGitDiff(htmlString: string): string {
  let DOMParserImpl: typeof DOMParser;
  if (typeof DOMParser === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    DOMParserImpl = require("linkedom").DOMParser;
  } else {
    DOMParserImpl = DOMParser;
  }
  const parser = new DOMParserImpl();
  const doc = parser.parseFromString(htmlString, "text/html");
  const rows = doc.querySelectorAll("tbody tr");

  const diffLines: string[] = [];

  rows.forEach((row) => {
    const additionCell = row.querySelector(".blob-code-addition");
    const deletionCell = row.querySelector(".blob-code-deletion");
    const contextCell = row.querySelector(".blob-code-context");
    const hunkHeaderCell = row.querySelector(".blob-code-hunk");
    const innerCell = row.querySelector(".blob-code-inner");

    if (hunkHeaderCell?.textContent) {
      diffLines.push(hunkHeaderCell.textContent.trim());
    } else if (additionCell?.textContent) {
      diffLines.push(`+${additionCell.textContent.trim()}`);
    } else if (deletionCell?.textContent) {
      diffLines.push(`-${deletionCell.textContent.trim()}`);
    } else if (contextCell?.textContent) {
      diffLines.push(` ${contextCell.textContent.trim()}`);
    } else if (innerCell?.textContent) {
      diffLines.push(` ${innerCell.textContent.trim()}`);
    }
  });

  return diffLines.join("\n");
}
