import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { GenerativeAiSettings } from "../types";

export const selfReview = async (
  review: string,
  settings: GenerativeAiSettings
): Promise<string> => {
  const isGroq = settings.defaultGenerativeAiConnector === "groq";
  const apiKey = isGroq ? settings.groqApiKey : settings.openAiApiKey;
  const baseURL = isGroq
    ? settings.groqEndpoint || "https://api.groq.com/openai/v1"
    : settings.openAiEndpoint || "https://api.openai.com/v1";
  const modelName = isGroq
    ? settings.defaultGroqModel
    : settings.defaultOpenAiModel;

  const prompt = ChatPromptTemplate.fromTemplate(
    "You are a senior software engineer reviewing the following AI generated code review. Improve clarity, accuracy and actionability. If no improvement is needed, return the text unchanged.\n\n{review}"
  );

  const chain = prompt
    .pipe(
      new ChatOpenAI({
        apiKey,
        baseURL,
        model: modelName,
        temperature: 0.3,
      })
    )
    .pipe(new StringOutputParser());

  return chain.invoke({ review });
};
