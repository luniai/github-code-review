import { GET_GITHUB_AUTH_TOKEN, GET_OPEN_AI_SETTINGS } from "./constants";
import { getGithubAuthToken, getOpenAiSettings } from "./utils/db_utils";

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === GET_OPEN_AI_SETTINGS) {
    getOpenAiSettings()
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
