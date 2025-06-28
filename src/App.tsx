import React, { useState, useEffect } from "react";
import {
	useGenerativeAiSettings,
	useGithubAuthToken,
} from "./hooks/use_settings";
import {
	defaultGenerativeAiSettings,
	chatgptModelOptions,
	availableGroqModels,
	CHATGPT_MODELS_URL,
} from "./constants";
import { GenerativeAiConnector } from "./types";
import "./App.css";
import ChatGPTModelSelector from "./components/chatgpt_model_selector";
import { CustomResetIcon } from "./components/reset_icon";

const VisibleEye = () => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clipPath="url(#clip0_9_3407)">
			<path
				d="M8.66669 16C8.66669 16 11.3334 10.6667 16 10.6667C20.6667 10.6667 23.3334 16 23.3334 16C23.3334 16 20.6667 21.3333 16 21.3333C11.3334 21.3333 8.66669 16 8.66669 16Z"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M16 18C17.1046 18 18 17.1046 18 16C18 14.8954 17.1046 14 16 14C14.8955 14 14 14.8954 14 16C14 17.1046 14.8955 18 16 18Z"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_9_3407">
				<rect
					width="16"
					height="16"
					fill="white"
					transform="translate(8 8)"
				/>
			</clipPath>
		</defs>
	</svg>
);

const HiddenEye = () => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clipPath="url(#clip0_9_3408)">
			<path
				d="M19.96 19.96C18.8204 20.8287 17.4328 21.3099 16 21.3333C11.3334 21.3333 8.66669 16 8.66669 16C9.49595 14.4546 10.6461 13.1044 12.04 12.04M14.6 10.8267C15.0589 10.7192 15.5287 10.6655 16 10.6667C20.6667 10.6667 23.3334 16 23.3334 16C22.9287 16.7571 22.4461 17.4698 21.8934 18.1267M17.4134 17.4133C17.2303 17.6098 17.0095 17.7674 16.7641 17.8767C16.5188 17.9861 16.254 18.0448 15.9854 18.0496C15.7169 18.0543 15.4501 18.0049 15.2011 17.9043C14.9521 17.8037 14.7258 17.654 14.5359 17.4641C14.346 17.2742 14.1963 17.048 14.0957 16.7989C13.9951 16.5499 13.9457 16.2831 13.9504 16.0146C13.9552 15.7461 14.014 15.4812 14.1233 15.2359C14.2326 14.9906 14.3902 14.7698 14.5867 14.5867M8.66669 8.66666L23.3334 23.3333"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_9_3408">
				<rect
					width="16"
					height="16"
					fill="white"
					transform="translate(8 8)"
				/>
			</clipPath>
		</defs>
	</svg>
);

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
	const [openAiEndpoint, setOpenAiEndpoint] = useState<string>(
		generativeAiSettings.openAiEndpoint || ""
	);
	const [groqApiKey, setGroqApiKey] = useState<string>(
		generativeAiSettings.groqApiKey
	);
	const [groqEndpoint, setGroqEndpoint] = useState<string>(
		generativeAiSettings.groqEndpoint || ""
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
	const [showGenerativeAiSuccess, setShowGenerativeAiSuccess] =
		useState(false);

	const [isVisibleApiKey, setIsVisibleApiKey] = useState(false);
	const [resetKey, setResetKey] = useState(0);

	useEffect(() => {
		setOpenAiApiKey(generativeAiSettings.openAiApiKey);
		setGroqApiKey(generativeAiSettings.groqApiKey);
		setOpenAiEndpoint(generativeAiSettings.openAiEndpoint || "");
		setGroqEndpoint(generativeAiSettings.groqEndpoint || "");
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

	const handleSaveAll = () => {
		updateGenerativeAiSettings({
			id: "default",
			openAiApiKey,
			groqApiKey,
			openAiEndpoint,
			groqEndpoint,
			customPrompt,
			customPromptRole,
			defaultOpenAiModel,
			defaultGroqModel,
			defaultGenerativeAiConnector:
				defaultGenerativeAiConnector as GenerativeAiConnector,
		});
		updateGithubAuthToken(authToken);
		setShowGithubTokenSuccess(true);
		setShowGenerativeAiSuccess(true);
	};

	const handleCancel = () => {
		setOpenAiApiKey(generativeAiSettings.openAiApiKey);
		setGroqApiKey(generativeAiSettings.groqApiKey);
		setOpenAiEndpoint(generativeAiSettings.openAiEndpoint || "");
		setGroqEndpoint(generativeAiSettings.groqEndpoint || "");
		setCustomPrompt(generativeAiSettings.customPrompt);
		setCustomPromptRole(generativeAiSettings.customPromptRole);
		setDefaultOpenAiModel(generativeAiSettings.defaultOpenAiModel);
		setDefaultGroqModel(generativeAiSettings.defaultGroqModel);
		setAuthToken(githubAuthToken);
	};

	const handleModelReset = () => {
		setDefaultOpenAiModel(defaultGenerativeAiSettings.defaultOpenAiModel);
		setDefaultGroqModel(defaultGenerativeAiSettings.defaultGroqModel);
		setResetKey((prevKey) => prevKey + 1);
	};

	const handlePromptRoleReset = () => {
		setCustomPromptRole(defaultGenerativeAiSettings.customPromptRole);
	};

	const handlePromptReset = () => {
		setCustomPrompt(defaultGenerativeAiSettings.customPrompt);
	};

	return (
		<div>
			<h2>
				<span role="img" aria-label="lightning">
					⚡
				</span>{" "}
				Generative AI Connector Settings
			</h2>
			<fieldset>
				<label>
					Select Connector:
					<br />
					<select
						value={defaultGenerativeAiConnector}
						onChange={(e) => {
							setDefaultGenerativeAiConnector(
								e.target.value as GenerativeAiConnector
							);
							setIsVisibleApiKey(false);
						}}
					>
						<option value="open-ai">Open AI</option>
						<option value="groq">Groq</option>
					</select>
				</label>
			</fieldset>

			{defaultGenerativeAiConnector === "open-ai" && (
				<>
					<fieldset className="api-input">
						<label>
							Open AI API Key:
							<div className="input-container">
								<input
									type={isVisibleApiKey ? "text" : "password"}
									value={openAiApiKey}
									onChange={(e) =>
										setOpenAiApiKey(e.target.value)
									}
									placeholder="open-api-key"
								/>
								<button
									type="button"
									className="visibility-toggle"
									onClick={() =>
										setIsVisibleApiKey((prev) => !prev)
									}
								>
									{isVisibleApiKey ? (
										<VisibleEye />
									) : (
										<HiddenEye />
									)}
								</button>
							</div>
						</label>
					</fieldset>
					<fieldset>
						<label>
							Custom Endpoint (optional):
							<input
								type="text"
								value={openAiEndpoint}
								onChange={(e) =>
									setOpenAiEndpoint(e.target.value)
								}
								placeholder="https://your-openai-endpoint"
							/>
						</label>
					</fieldset>
					<fieldset>
						<label>
							{" "}
							Select Model:
							<div className="select-model-wrapper">
								<div className="select-reset-box">
									<ChatGPTModelSelector
										key={resetKey}
										defaultValue={[
											generativeAiSettings.defaultOpenAiModel,
										]}
									/>{" "}
									<button
										type="button"
										onClick={handleModelReset}
										aria-label="Reset model to default"
										className="reset-button"
									>
										<CustomResetIcon />
									</button>
								</div>
							</div>
						</label>
						<p>Here are some available ChatGPT model options:</p>
						<div className="text-wrapper">
							<p>
								<b>
									{chatgptModelOptions.items
										? chatgptModelOptions.items
												.map((model) => model.label)
												.join(", ")
										: "No models available"}
								</b>
							</p>
							<br />
							<p>
								For a complete list of models, please check the{" "}
								<a
									href={CHATGPT_MODELS_URL}
									target="_blank"
									rel="noopener noreferrer"
								>
									ChatGPT models page
								</a>
								.
							</p>
						</div>
					</fieldset>
				</>
			)}

			{defaultGenerativeAiConnector === "groq" && (
				<>
					<fieldset className="api-input">
						<label>
							Groq API Key:
							<div className="input-container">
								<input
									type={isVisibleApiKey ? "text" : "password"}
									value={groqApiKey}
									onChange={(e) =>
										setGroqApiKey(e.target.value)
									}
									placeholder="groq-api-key"
								/>
								<button
									type="button"
									className="visibility-toggle"
									onClick={() =>
										setIsVisibleApiKey((prev) => !prev)
									}
									aria-label={
										isVisibleApiKey
											? "Hide API key"
											: "Show API key"
									}
								>
									{isVisibleApiKey ? (
										<VisibleEye />
									) : (
										<HiddenEye />
									)}
								</button>
							</div>
						</label>
					</fieldset>
					<fieldset>
						<label>
							Custom Endpoint (optional):
							<input
								type="text"
								value={groqEndpoint}
								onChange={(e) =>
									setGroqEndpoint(e.target.value)
								}
								placeholder="https://your-groq-endpoint"
							/>
						</label>
					</fieldset>
					<fieldset>
						<label>
							Model:
							<br />
							<select
								value={defaultGroqModel}
								onChange={(e) =>
									setDefaultGroqModel(e.target.value)
								}
							>
								{availableGroqModels.map((m) => (
									<option key={m} value={m}>
										{m}
									</option>
								))}
							</select>
						</label>
						<button
							className="global-button"
							disabled={
								defaultGroqModel ===
								defaultGenerativeAiSettings.defaultGroqModel
							}
							onClick={handleModelReset}
						>
							↺ Reset to default
						</button>
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
				<button
					onClick={handlePromptRoleReset}
					className="global-button"
				>
					Reset to default
				</button>
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

			<h2>
				<span role="img" aria-label="octopus">
					🐙
				</span>{" "}
				GitHub Settings
			</h2>
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
			{showGithubTokenSuccess && (
				<div>GitHub token saved successfully!</div>
			)}
			<div className="action-buttons">
				<button className="cancel-btn" onClick={handleCancel}>
					Cancel
				</button>
				<button className="save-settings-btn" onClick={handleSaveAll}>
					Save Settings
				</button>
			</div>
		</div>
	);
};

export default SettingsComponent;
