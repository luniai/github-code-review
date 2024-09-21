import { db } from "../db";
import { GithubSettings, GenerativeAiSettings } from "../types";

// OpenAI Settings CRUD operations
export const saveGenerativeAiSettings = async (
  settings: GenerativeAiSettings
): Promise<void> => {
  await db.generativeAiSettings.put(settings);
};

export const getGenerativeAiSettings = async (): Promise<
  GenerativeAiSettings | undefined
> => {
  return await db.generativeAiSettings.get("default");
};

// GitHub Settings CRUD operations
export const saveGithubAuthToken = async (authToken: string): Promise<void> => {
  await db.githubSettings.put({ id: "default", authToken });
};

export const getGithubAuthToken = async (): Promise<
  GithubSettings | undefined
> => {
  return await db.githubSettings.get("default");
};
