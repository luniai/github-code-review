// hooks/useSettings.ts

import { useState, useEffect } from "react";
import {
  getOpenAiSettings,
  saveOpenAiSettings,
  getGithubAuthToken,
  saveGithubAuthToken,
} from "../utils/db_utils";
import { OpenAiSettings } from "../types";
import { defaultOpenAiSettings } from "../constants";

export const useOpenAiSettings = (): [
  OpenAiSettings,
  (newSettings: OpenAiSettings) => Promise<void>
] => {
  const [settings, setSettings] = useState<OpenAiSettings>(
    defaultOpenAiSettings
  );

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getOpenAiSettings();
      if (data) setSettings(data);
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: OpenAiSettings) => {
    await saveOpenAiSettings(newSettings);
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
