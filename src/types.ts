export type GenerativeAiConnector = 'open-ai' | 'groq';
export interface GenerativeAiSettings {
    id: string; // 'default' or unique identifier
    openAiApiKey: string;
    groqApiKey: string;
    defaultOpenAiModel: string;
    defaultGroqModel: string;
    customPrompt: string;
    customPromptRole: string;
    defaultGenerativeAiConnector: GenerativeAiConnector;
}

export interface GithubSettings {
    id: string; // 'default' or unique identifier
    authToken: string;
}

export interface ModelDropdownProps {
    defaultValue: string[];
    size?: 'md';
    width?: string;
}
