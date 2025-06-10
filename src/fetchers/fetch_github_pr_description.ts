import { GET_GITHUB_AUTH_TOKEN } from "../constants";
import { GithubSettings } from "../types";

const GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql";

function fetchGithubAuthTokenFromBackground(): Promise<
  GithubSettings | undefined
> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: GET_GITHUB_AUTH_TOKEN }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.error));
      }
    });
  });
}

const query = `
  query($owner: String!, $repo: String!, $prNumber: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $prNumber) {
        body,
        title
      }
    }
  }
`;

export const fetchGithubPRTitleAndDescription = async (variables: {
  owner: string;
  repo: string;
  prNumber: number;
}) => {
  try {
    const githubSettings = await fetchGithubAuthTokenFromBackground();
    const token = githubSettings?.authToken;

    if (!token) {
      throw new Error("GitHub token not configured");
    }

    const response = await fetch(GITHUB_GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      title: result.data.repository.pullRequest.title,
      description: result.data.repository.pullRequest.body,
    };
  } catch (error: any) {
    throw new Error(`Error fetching PR description: ${error.message}`);
  }
};
