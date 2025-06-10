import {
  defaultGenerativeAiSettings,
  GET_GENERATIVE_AI_SETTINGS,
} from "../constants";
import { GenerativeAiSettings, AIMessage } from "../types";

const OPEN_AI_V1_CHAT_COMPLETIONS_URL =
  "https://api.openai.com/v1/chat/completions";

function fetchGenerativeAiSettingsFromBackground(): Promise<
  GenerativeAiSettings | undefined
> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: GET_GENERATIVE_AI_SETTINGS },
      (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
      }
    );
  });
}

export const sendOpenAiReview = async ({
  file,
  codeDiff,
  prDescription,
  repository,
  prTitle,
  messages = [],
}: {
  file: string;
  codeDiff: string;
  prDescription: string;
  repository: string;
  prTitle: string;
  messages?: AIMessage[];
}) => {
  // Fetch API key from background script via IndexedDB
  const generativeAiSettings = await fetchGenerativeAiSettingsFromBackground();
  const apiKey = generativeAiSettings?.openAiApiKey;
  if (!apiKey) {
    throw new Error("OpenAI API key not found in IndexedDB.");
  }

  const model = generativeAiSettings?.defaultOpenAiModel;

  const getCustomPrompt = () => {
    const customPrompt =
      generativeAiSettings?.customPrompt ||
      defaultGenerativeAiSettings.customPrompt;

    // replace template variables wrapped by "{{}}" with the actual variables
    return customPrompt
      .replace("{{prTitle}}", prTitle)
      .replace("{{prDescription}}", prDescription)
      .replace("{{repository}}", repository)
      .replace("{{file}}", file)
      .replace("{{codeDiff}}", codeDiff);
  };

  const baseMessages: AIMessage[] = [
    {
      role: "system",
      content:
        generativeAiSettings?.customPromptRole ||
        defaultGenerativeAiSettings.customPromptRole,
    },
    {
      role: "user",
      content: getCustomPrompt(),
    },
  ];

  const allMessages = baseMessages.concat(messages);

  const response = await fetch(OPEN_AI_V1_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || defaultGenerativeAiSettings.defaultOpenAiModel,
      messages: allMessages,
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
