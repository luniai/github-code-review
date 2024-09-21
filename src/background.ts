import { GET_GITHUB_AUTH_TOKEN, GET_GENERATIVE_AI_SETTINGS } from "./constants";
import { getGithubAuthToken, getGenerativeAiSettings } from "./utils/db_utils";

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === GET_GENERATIVE_AI_SETTINGS) {
    getGenerativeAiSettings()
      .then((settings) => {
        sendResponse({ success: true, data: settings });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === GET_GITHUB_AUTH_TOKEN) {
    getGithubAuthToken()
      .then((settings) => {
        sendResponse({ success: true, data: settings });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});
