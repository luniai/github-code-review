import { GET_GENERATIVE_AI_SETTINGS } from "../constants";
import { GenerativeAiSettings } from "../types";
import { sendGroqReview } from "./send_groq_review";
import { sendOpenAiReview } from "./send_open_ai_review";

function fetchGenerativeAiSettingsFromBackground(): Promise<
  GenerativeAiSettings | undefined
> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: GET_GENERATIVE_AI_SETTINGS },
      (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
      }
    );
  });
}

export const sendAiReview = async ({
  file,
  codeDiff,
  prDescription,
  repository,
  prTitle,
}: {
  file: string;
  codeDiff: string;
  prDescription: string;
  repository: string;
  prTitle: string;
}) => {
  // Fetch API key from background script via IndexedDB
  const generativeAiSettings = await fetchGenerativeAiSettingsFromBackground();

  const defaultGenerativeAiConnector =
    generativeAiSettings?.defaultGenerativeAiConnector;

  const sendAiFn =
    defaultGenerativeAiConnector === "groq" ? sendGroqReview : sendOpenAiReview;

  return sendAiFn({
    file,
    codeDiff,
    prDescription,
    repository,
    prTitle,
  });
};
