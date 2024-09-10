export const extractGitHubPRDetails = (url: string) => {
  const regex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
  const match = url.match(regex);

  if (match) {
    const [, owner, repo, prNumber] = match;
    return {
      owner,
      repo,
      prNumber: parseInt(prNumber, 10),
    };
  } else {
    throw new Error("Invalid GitHub PR URL");
  }
};
