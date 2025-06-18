import { GET_GENERATIVE_AI_SETTINGS } from "../constants";
import { GenerativeAiSettings, AIMessage } from "../types";
import { sendGroqReview } from "./send_groq_review";
import { sendOpenAiReview } from "./send_open_ai_review";
import { selfReview } from "./self_review";

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
  messages = [],
}: {
  file: string;
  codeDiff: string;
  prDescription: string;
  repository: string;
  prTitle: string;
  messages?: AIMessage[];
}) => {
  // Fetch API key from background script via IndexedDB
  const generativeAiSettings = await fetchGenerativeAiSettingsFromBackground();

  const defaultGenerativeAiConnector =
    generativeAiSettings?.defaultGenerativeAiConnector;

  const sendAiFn =
    defaultGenerativeAiConnector === "groq" ? sendGroqReview : sendOpenAiReview;

  const review = await sendAiFn({
    file,
    codeDiff,
    prDescription,
    repository,
    prTitle,
    messages,
  });

  if (generativeAiSettings) {
    return selfReview(review, generativeAiSettings);
  }

  return review;
};
