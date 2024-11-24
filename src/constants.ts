import { GenerativeAiSettings } from "./types";
import { createListCollection } from "@chakra-ui/react";

export const GET_GENERATIVE_AI_SETTINGS = "GET_GENERATIVE_AI_SETTINGS";

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

export const CHATGPT_MODELS_URL = "https://platform.openai.com/docs/models";

// export const availableModels = [
//   "gpt-4o",
//   "gpt-4o-mini",
//   "gpt-4o-turbo",
//   "gpt-4",
//   "gpt-3.5-turbo",
// ]; 
export const availableModels = createListCollection({
  items: [
    { label: "gpt-4o", value: "gpt-4o" },
    { label: "gpt-4o-mini", value: "gpt-4o-mini" },
    { label: "gpt-4o-turbo", value: "gpt-4o-turbo" },
    { label: "gpt-4", value: "gpt-4" },
    { label: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
  ],
})

export const defaultGenerativeAiSettings: GenerativeAiSettings = {
  id: "default",
  openAiApiKey: "",
  groqApiKey: "",
  defaultOpenAiModel: "gpt-4o-mini",
  defaultGroqModel: "llama-3.1-70b-versatile",
  customPrompt,
  customPromptRole,
  defaultGenerativeAiConnector: "open-ai",
};
