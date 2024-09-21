import Dexie, { Table } from "dexie";
import { GenerativeAiSettings, GithubSettings } from "./types";
import { defaultGenerativeAiSettings } from "./constants";

// Define the Dexie database with TypeScript
class SettingsDatabase extends Dexie {
  generativeAiSettings!: Table<GenerativeAiSettings, string>; // Table for OpenAI settings
  githubSettings!: Table<GithubSettings, string>; // Table for GitHub settings

  constructor() {
    super("SettingsDatabase");
    this.version(1).stores({
      generativeAiSettings:
        "id, openAiApiKey, groqApiKey, defaultOpenAiModel, defaultGroqModel, customPrompt, customPromptRole, defaultGenerativeAiConnector", // Indexed by 'id'
      githubSettings: "id, authToken", // Indexed by 'id'
    });

    // Initialize with default values
    this.on("populate", () => {
      this.generativeAiSettings.put(defaultGenerativeAiSettings);
      this.githubSettings.put({ id: "default", authToken: "" });
    });
  }
}

const db = new SettingsDatabase();
export { db };
