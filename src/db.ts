import Dexie, { Table } from "dexie";
import { OpenAiSettings, GithubSettings } from "./types";
import { defaultOpenAiSettings } from "./constants";

// Define the Dexie database with TypeScript
class SettingsDatabase extends Dexie {
  openAiSettings!: Table<OpenAiSettings, string>; // Table for OpenAI settings
  githubSettings!: Table<GithubSettings, string>; // Table for GitHub settings

  constructor() {
    super("SettingsDatabase");
    this.version(1).stores({
      openAiSettings: "id, apiKey, model, customPrompt, customPromptRole", // Indexed by 'id'
      githubSettings: "id, authToken", // Indexed by 'id'
    });

    // Initialize with default values
    this.on("populate", () => {
      this.openAiSettings.put(defaultOpenAiSettings);
      this.githubSettings.put({ id: "default", authToken: "" });
    });
  }
}

const db = new SettingsDatabase();
export { db };
