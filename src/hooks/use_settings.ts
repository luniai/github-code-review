// hooks/useSettings.ts

import { useState, useEffect } from "react";
import {
  getGenerativeAiSettings,
  saveGenerativeAiSettings,
  getGithubAuthToken,
  saveGithubAuthToken,
} from "../utils/db_utils";
import { GenerativeAiSettings } from "../types";
import { defaultGenerativeAiSettings } from "../constants";

export const useGenerativeAiSettings = (): [
  GenerativeAiSettings,
  (newSettings: GenerativeAiSettings) => Promise<void>
] => {
  const [settings, setSettings] = useState<GenerativeAiSettings>(
    defaultGenerativeAiSettings
  );

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getGenerativeAiSettings();
      if (data) setSettings(data);
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: GenerativeAiSettings) => {
    await saveGenerativeAiSettings(newSettings);
    setSettings(newSettings);
  };

  return [settings, updateSettings];
};

export const useGithubAuthToken = (): [
  string,
  (newToken: string) => Promise<void>
] => {
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getGithubAuthToken();
      if (token) setAuthToken(token.authToken);
    };

    fetchToken();
  }, []);

  const updateAuthToken = async (newToken: string) => {
    await saveGithubAuthToken(newToken);
    setAuthToken(newToken);
  };

  return [authToken, updateAuthToken];
};
