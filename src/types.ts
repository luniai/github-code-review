export type GenerativeAiConnector = "open-ai" | "groq";
export interface GenerativeAiSettings {
  id: string; // 'default' or unique identifier
  openAiApiKey: string;
  groqApiKey: string;
  defaultOpenAiModel: string;
  defaultGroqModel: string;
  openAiEndpoint?: string;
  groqEndpoint?: string;
  customPrompt: string;
  customPromptRole: string;
  defaultGenerativeAiConnector: GenerativeAiConnector;
}

export interface GithubSettings {
  id: string; // 'default' or unique identifier
  authToken: string;
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
