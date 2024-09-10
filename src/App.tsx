import React, { useState, useEffect } from "react";
import { useOpenAiSettings, useGithubAuthToken } from "./hooks/use_settings";
import { defaultOpenAiSettings } from "./constants";

const SettingsComponent: React.FC = () => {
  // Hooks to manage state for OpenAI and GitHub settings
  const [openAiSettings, updateOpenAiSettings] = useOpenAiSettings();
  const [githubAuthToken, updateGithubAuthToken] = useGithubAuthToken();

  // Local state for form inputs
  const [apiKey, setApiKey] = useState<string>(openAiSettings.apiKey);
  const [model, setModel] = useState<string>(openAiSettings.model);
  const [customPromptRole, setCustomPromptRole] = useState<string>(
    openAiSettings.customPromptRole
  );

  const [customPrompt, setCustomPrompt] = useState<string>(
    openAiSettings.customPrompt
  );
  const [authToken, setAuthToken] = useState<string>(githubAuthToken);

  const [showGithubTokenSuccess, setShowGithubTokenSuccess] = useState(false);
  const [showOpenAiSettingsSuccess, setShowOpenAiSettingsSuccess] =
    useState(false);

  // Synchronize input fields with the fetched settings
  useEffect(() => {
    setApiKey(openAiSettings.apiKey);
    setModel(openAiSettings.model);
    setCustomPrompt(openAiSettings.customPrompt);
    setCustomPromptRole(openAiSettings.customPromptRole);
  }, [openAiSettings]);

  useEffect(() => {
    setAuthToken(githubAuthToken);
  }, [githubAuthToken]);

  // hide the success message after 3 seconds
  useEffect(() => {
    if (showGithubTokenSuccess) {
      const timeout = setTimeout(() => {
        setShowGithubTokenSuccess(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showGithubTokenSuccess]);

  // hide the success message after 3 seconds
  useEffect(() => {
    if (showOpenAiSettingsSuccess) {
      const timeout = setTimeout(() => {
        setShowOpenAiSettingsSuccess(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showOpenAiSettingsSuccess]);

  const handleSaveOpenAiSettings = () => {
    updateOpenAiSettings({
      id: "default",
      apiKey,
      model,
      customPrompt,
      customPromptRole,
    });
    setShowOpenAiSettingsSuccess(true);
  };

  const handleSaveGithubToken = () => {
    updateGithubAuthToken(authToken);
    setShowGithubTokenSuccess(true);
  };

  const handleModelReset = () => {
    setModel(defaultOpenAiSettings.model);
  };
  const handlePromptRoleReset = () => {
    setCustomPromptRole(defaultOpenAiSettings.customPromptRole);
  };
  const handlePromptReset = () => {
    setCustomPrompt(defaultOpenAiSettings.customPrompt);
  };

  return (
    <div>
      <h2>OpenAI Settings</h2>
      <fieldset>
        <label>
          API Key:
          <br />
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
      </fieldset>
      <fieldset>
        <label>
          Model:
          <br />
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </label>
        <button onClick={handleModelReset}>Reset to default</button>
      </fieldset>
      <fieldset>
        <label>
          Custom Prompt Role:
          <br />
          <textarea
            rows={10}
            value={customPromptRole}
            onChange={(e) => setCustomPromptRole(e.target.value)}
          />
        </label>
        <button onClick={handlePromptRoleReset}>Reset to default</button>
      </fieldset>
      <fieldset>
        <label>
          Custom Prompt:
          <br />
          <textarea
            value={customPrompt}
            rows={10}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        </label>
        <button onClick={handlePromptReset}>Reset to default</button>
      </fieldset>
      {showOpenAiSettingsSuccess && (
        <div>OpenAI settings saved successfully!</div>
      )}
      <button onClick={handleSaveOpenAiSettings}>Save OpenAI Settings</button>

      <h2>GitHub Settings</h2>
      <fieldset>
        <label>
          Auth Token:
          <input
            type="text"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
          />
        </label>
      </fieldset>
      {showGithubTokenSuccess && <div>GitHub token saved successfully!</div>}
      <button onClick={handleSaveGithubToken}>Save GitHub Token</button>
    </div>
  );
};

export default SettingsComponent;
