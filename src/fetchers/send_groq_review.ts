import {
  defaultGenerativeAiSettings,
  GET_GENERATIVE_AI_SETTINGS,
} from "../constants";
import { GenerativeAiSettings } from "../types";

const GROQ_V1_CHAT_COMPLETIONS_URL =
  "https://api.groq.com/openai/v1/chat/completions";

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

export const sendGroqReview = async ({
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
  const generativeAiSettings = await fetchGenerativeAiSettingsFromBackground();
  const apiKey = generativeAiSettings?.groqApiKey;
  if (!apiKey) {
    throw new Error("Groq API key not found in IndexedDB.");
  }

  const model = generativeAiSettings?.defaultGroqModel;

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

  const messages = [
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

  const response = await fetch(GROQ_V1_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || defaultGenerativeAiSettings?.defaultGroqModel,
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
