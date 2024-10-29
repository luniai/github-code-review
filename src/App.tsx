import React, { useState, useEffect } from "react";
import {
  useGenerativeAiSettings,
  useGithubAuthToken,
} from "./hooks/use_settings";
import { defaultGenerativeAiSettings } from "./constants";
import { GenerativeAiConnector } from "./types";

const SettingsComponent: React.FC = () => {
  const [generativeAiSettings, updateGenerativeAiSettings] =
    useGenerativeAiSettings();
  const [githubAuthToken, updateGithubAuthToken] = useGithubAuthToken();

  // Local state for form inputs
  const [defaultGenerativeAiConnector, setDefaultGenerativeAiConnector] =
    useState<GenerativeAiConnector>(
      generativeAiSettings.defaultGenerativeAiConnector
    ); // Default to Open AI
  const [openAiApiKey, setOpenAiApiKey] = useState<string>(
    generativeAiSettings.openAiApiKey
  );
  const [groqApiKey, setGroqApiKey] = useState<string>(
    generativeAiSettings.groqApiKey
  );
  const [defaultOpenAiModel, setDefaultOpenAiModel] = useState<string>(
    generativeAiSettings.defaultOpenAiModel
  );
  const [defaultGroqModel, setDefaultGroqModel] = useState<string>(
    generativeAiSettings.defaultGroqModel
  );
  const [customPromptRole, setCustomPromptRole] = useState<string>(
    generativeAiSettings.customPromptRole
  );
  const [customPrompt, setCustomPrompt] = useState<string>(
    generativeAiSettings.customPrompt
  );
  const [authToken, setAuthToken] = useState<string>(githubAuthToken);
  const [showGithubTokenSuccess, setShowGithubTokenSuccess] = useState(false);
  const [showGenerativeAiSuccess, setShowGenerativeAiSuccess] = useState(false);

  useEffect(() => {
    setOpenAiApiKey(generativeAiSettings.openAiApiKey);
    setGroqApiKey(generativeAiSettings.groqApiKey);
    setCustomPrompt(generativeAiSettings.customPrompt);
    setCustomPromptRole(generativeAiSettings.customPromptRole);
    setDefaultOpenAiModel(generativeAiSettings.defaultOpenAiModel);
    setDefaultGroqModel(generativeAiSettings.defaultGroqModel);
  }, [generativeAiSettings]);

  useEffect(() => {
    setAuthToken(githubAuthToken);
  }, [githubAuthToken]);

  useEffect(() => {
    if (showGithubTokenSuccess) {
      const timeout = setTimeout(() => {
        setShowGithubTokenSuccess(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showGithubTokenSuccess]);

  useEffect(() => {
    if (showGenerativeAiSuccess) {
      const timeout = setTimeout(() => {
        setShowGenerativeAiSuccess(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showGenerativeAiSuccess]);

  const handleSaveSettings = () => {
    updateGenerativeAiSettings({
      id: "default",
      openAiApiKey,
      groqApiKey,
      customPrompt,
      customPromptRole,
      defaultOpenAiModel,
      defaultGroqModel,
      defaultGenerativeAiConnector:
        defaultGenerativeAiConnector as GenerativeAiConnector,
    });
    setShowGenerativeAiSuccess(true);
  };

  const handleSaveGithubToken = () => {
    updateGithubAuthToken(authToken);
    setShowGithubTokenSuccess(true);
  };

  const handleModelReset = () => {
    setDefaultOpenAiModel(defaultGenerativeAiSettings.defaultOpenAiModel);
    setDefaultGroqModel(defaultGenerativeAiSettings.defaultGroqModel);
  };

  const handlePromptRoleReset = () => {
    setCustomPromptRole(defaultGenerativeAiSettings.customPromptRole);
  };

  const handlePromptReset = () => {
    setCustomPrompt(defaultGenerativeAiSettings.customPrompt);
  };

  return (
    <div>
      <h2>Generative AI Connector Settings</h2>
      <fieldset>
        <label>
          Select Connector:
          <br />
          <select
            value={defaultGenerativeAiConnector}
            onChange={(e) =>
              setDefaultGenerativeAiConnector(
                e.target.value as GenerativeAiConnector
              )
            }
          >
            <option value="open-ai">Open AI</option>
            <option value="groq">Groq</option>
          </select>
        </label>
      </fieldset>

      {defaultGenerativeAiConnector === "open-ai" && (
        <>
          <fieldset>
            <label>
              Open AI API Key:
              <br />
              <input
                type="text"
                value={openAiApiKey}
                onChange={(e) => setOpenAiApiKey(e.target.value)}
              />
            </label>
          </fieldset>
          <fieldset>
            <label>
              Select Model:
              <br />
              <input
                type="text"
                value={defaultOpenAiModel}
                onChange={(e) => setDefaultOpenAiModel(e.target.value)}
                list="modelOptions"
              />
            </label>
            <datalist id="modelOptions">
              <option value="gpt-4o" />
              <option value="gpt-4o-mini" />
              <option value="gpt-4o-turbo" />
              <option value="gpt-4" />
              <option value="gpt-3.5-turbo" />            
            </datalist>
            <button onClick={handleModelReset}>Reset to default</button>
            <p>Here are some available ChatGPT model options:</p>
            <p>
            <b>gpt-4o </b>, 
            <b>gpt-4o-mini </b>, 
            <b>gpt-4-turbo </b>, 
            <b>gpt-4 </b>, and <b>gpt-3.5-turbo</b>
            </p>
          
           <p>For a complete list of models, please check the <a href="https://platform.openai.com/docs/models" target="_blank">ChatGPT models page</a>.</p>
          </fieldset>
        </>
      )}

      {defaultGenerativeAiConnector === "groq" && (
        <>
          <fieldset>
            <label>
              Groq API Key:
              <br />
              <input
                type="text"
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
              />
            </label>
          </fieldset>
          <fieldset>
            <label>
              Model:
              <br />
              <input
                type="text"
                value={defaultGroqModel}
                onChange={(e) => setDefaultGroqModel(e.target.value)}
              />
            </label>
            <button onClick={handleModelReset}>Reset to default</button>
          </fieldset>
        </>
      )}
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

      {showGenerativeAiSuccess && <div>Settings saved successfully!</div>}
      <button onClick={handleSaveSettings}>Save Settings</button>

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
