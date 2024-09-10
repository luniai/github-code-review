import { defaultOpenAiSettings, GET_OPEN_AI_SETTINGS } from "../constants";
import { OpenAiSettings } from "../types";

function fetchOpenAiSettingsFromBackground(): Promise<
  OpenAiSettings | undefined
> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: GET_OPEN_AI_SETTINGS }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.error));
      }
    });
  });
}

export const sendOpenAiReview = async ({
  file,
  codeDiff,
  prDescription,
  repository,
  prTitle,
}: {
  file: string;
  codeDiff: string;
  prDescription: string;
  repository: string;
  prTitle: string;
}) => {
  // Fetch API key from background script via IndexedDB
  const openApiSettings = await fetchOpenAiSettingsFromBackground();
  const apiKey = openApiSettings?.apiKey;
  if (!apiKey) {
    throw new Error("OpenAI API key not found in IndexedDB.");
  }

  const model = openApiSettings?.model;

  const url = "https://api.openai.com/v1/chat/completions";

  const getCustomPrompt = () => {
    const customPrompt =
      openApiSettings?.customPrompt || defaultOpenAiSettings.customPrompt;

    // replace template variables wrapped by "{{}}" with the actual variables
    return customPrompt
      .replace("{{prTitle}}", prTitle)
      .replace("{{prDescription}}", prDescription)
      .replace("{{repository}}", repository)
      .replace("{{file}}", file)
      .replace("{{codeDiff}}", codeDiff);
  };

  const messages = [
    {
      role: "system",
      content:
        openApiSettings?.customPromptRole ||
        defaultOpenAiSettings.customPromptRole,
    },
    {
      role: "user",
      content: getCustomPrompt(),
    },
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || defaultOpenAiSettings.model,
      messages: messages,
      max_tokens: 2500,
      temperature: 0.3, // Adjusted for more focused and deterministic output
    }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};
