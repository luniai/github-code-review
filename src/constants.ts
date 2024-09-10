export const GET_OPEN_AI_SETTINGS = "GET_OPEN_AI_SETTINGS";

export const GET_GITHUB_AUTH_TOKEN = "GET_GITHUB_AUTH_TOKEN";

export const customPrompt = `## GitHub PR Title

{{prTitle}} 

## Github PR Description

{{prDescription}}

## GitHub Repository

{{repository}}

## Changes made to the file {file} for your review

{{codeDiff}}
`;

export const customPromptRole =
  "You are a senior software engineer providing in-depth code review feedback for a Pull Request in GitHub. Your goal is to ensure that the code is readable, maintainable, and aligns with the original proposal and coding standards.";

export const defaultOpenAiSettings = {
  id: "default",
  apiKey: "",
  model: "gpt-4o-mini",
  customPrompt,
  customPromptRole,
};
