export interface OpenAiSettings {
  id: string; // 'default' or unique identifier
  apiKey: string;
  model: string;
  customPrompt: string;
  customPromptRole: string;
}

export interface GithubSettings {
  id: string; // 'default' or unique identifier
  authToken: string;
}
