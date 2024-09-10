import { db } from "../db";
import { GithubSettings, OpenAiSettings } from "../types";

// OpenAI Settings CRUD operations
export const saveOpenAiSettings = async (
  settings: OpenAiSettings
): Promise<void> => {
  await db.openAiSettings.put(settings);
};

export const getOpenAiSettings = async (): Promise<
  OpenAiSettings | undefined
> => {
  return await db.openAiSettings.get("default");
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
