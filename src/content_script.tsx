import logo from "./assets/logo.jpg";
import { createRoot } from "react-dom/client";
import { domUpdateWatcher } from "./utils/dom_update_watcher";
import { useEffect, useState } from "react";
import { extractGitHubPRDetails } from "./utils/extract_github_pr_details";
import { fetchGithubPRTitleAndDescription } from "./fetchers/fetch_github_pr_description";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { domChangeWatcher } from "./utils/dom_change_watcher";
import { sendAiReview } from "./fetchers/send_ai_review";
import { AIMessage } from "./types";

const GITHUB_PR_DETAILS_QUERY_KEY = "githubPrDetails";
const OPEN_AI_REVIEW_QUERY_KEY = "openAiReview";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  },
});

interface ReviewContainerProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  diffHtml: string;
  file: string;
  // reviewContainerElement: HTMLDivElement;
}

import { parseHtmlToGitDiff } from "./utils/parse_git_diff";

// eslint-disable-next-line react-refresh/only-export-components
const ReviewContainer = ({ isOpen, diffHtml, file }: ReviewContainerProps) => {
  const githubPrDetails = extractGitHubPRDetails(window.location.href);

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const {
    data: prReviewData,
    isLoading,
    isError,
  } = useQuery(
    [GITHUB_PR_DETAILS_QUERY_KEY, window.location.href],
    () => fetchGithubPRTitleAndDescription(githubPrDetails),
    {
      enabled: isOpen,
    }
  );

  const {
    data: AIReviewData,
    isLoading: isAIReviewLoading,
    isError: isAIReviewError,
    isIdle: isAiReviewIdle,
  } = useQuery(
    [OPEN_AI_REVIEW_QUERY_KEY, file, diffHtml.length],
    () =>
      sendAiReview({
        file,
        codeDiff: diffHtml,
        prDescription: prReviewData?.description,
        prTitle: prReviewData?.title,
        repository: `${githubPrDetails.owner}/${githubPrDetails.repo}`,
      }),
    {
      enabled: Boolean(prReviewData),
    }
  );

  useEffect(() => {
    if (AIReviewData) {
      setMessages([{ role: "assistant", content: AIReviewData }]);
    }
  }, [AIReviewData]);

  const handleReply = async () => {
    if (!replyText) return;
    setIsReplyLoading(true);
    setReplyError(null);
    try {
      const answer = await sendAiReview({
        file,
        codeDiff: diffHtml,
        prDescription: prReviewData?.description,
        prTitle: prReviewData?.title,
        repository: `${githubPrDetails.owner}/${githubPrDetails.repo}`,
        messages: messages.concat({ role: "user", content: replyText }),
      });
      setMessages((prev) =>
        prev.concat(
          { role: "user", content: replyText },
          { role: "assistant", content: answer }
        )
      );
      setReplyText("");
    } catch (err: any) {
      setReplyError(err.message);
    } finally {
      setIsReplyLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        backgroundImage: `url(${chrome.runtime.getURL(logo)})`,
      }}
      className="luni-ai-github-code-review-container"
    >
      <h2>AI Review</h2>
      <h3>PR Data:</h3>
      {isLoading && <p>Loading PR Data...</p>}
      {isError && <p>Error fetching PR description</p>}
      {prReviewData ? (
        <>
          <h4>{prReviewData.title}</h4>
          <pre>{prReviewData.description}</pre>
        </>
      ) : null}
      <br />
      <h3>AI Review:</h3>
      {isAiReviewIdle && (
        <p>Waiting for PR Data to load to initiate PR Review</p>
      )}
      {isAIReviewLoading && <p>Initiating AI Review...</p>}
      {isAIReviewError && <p>Error fetching AI review</p>}
      {messages.map((m, idx) => (
        <pre key={idx}>{m.content}</pre>
      ))}
      {AIReviewData && (
        <div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            cols={50}
          />
          <br />
          <button onClick={handleReply} disabled={isReplyLoading}>
            Reply
          </button>
          {isReplyLoading && <span> Sending...</span>}
          {replyError && <p>Error: {replyError}</p>}
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const AIReviewButton = () => {
  const [fileHeadersLength, setFileHeadersLength] = useState(
    document.querySelectorAll("#files .file .file-header").length || 0
  );

  // Listen for changes in the DOM to update the fileHeadersLength state
  useEffect(() => {
    const disconnectObserver = domChangeWatcher(
      "#files .file .file-header",
      () => {
        setFileHeadersLength(
          document.querySelectorAll("#files .file .file-header").length
        );
      }
    );

    return () => {
      disconnectObserver();
    };
  }, []);

  useEffect(() => {
    const hasAiReviewButton =
      document.getElementsByClassName("ai-review-button");

    const fileHeaders = document.querySelectorAll("#files .file .file-header");

    if (hasAiReviewButton.length === fileHeaders.length) {
      return;
    }

    for (let fileIndex = 0; fileIndex < fileHeaders.length; fileIndex++) {
      const fileHeader = fileHeaders[fileIndex];
      const fileActions = fileHeader.querySelector(".file-actions div");
      if (fileActions) {
        if (fileActions.querySelector(".ai-review-button")) {
          continue;
        }
        const button = document.createElement("button");
        button.innerText = "AI-Review";
        button.setAttribute("class", "ai-review-button");
        button.setAttribute(
          "style",
          `background-image: url(${chrome.runtime.getURL(logo)});`
        );
        button.setAttribute("data-index", fileIndex.toString());
        button.setAttribute("data-is-open", "false");
        fileActions.prepend(button);

        const reviewContainer = document.createElement("div");
        const parent = fileHeader.parentElement;
        const fileContent = parent?.querySelector(".js-file-content");
        reviewContainer.setAttribute("class", "ai-review-container");
        if (fileContent) {
          parent?.insertBefore(reviewContainer, fileContent);
          // setReviewContainerElement(reviewContainer);
        }

        button.onclick = async () => {
          const fileIndex = parseInt(button.getAttribute("data-index") || "0");
          const fileDiff =
            document.querySelectorAll(".js-file-content")[fileIndex].innerHTML;

          const parsedDiffHtml = parseHtmlToGitDiff(fileDiff);

          const fileName =
            document.querySelectorAll(".file-info a")[fileIndex].textContent ||
            "";

          const isOpen = button.getAttribute("data-is-open") === "true";

          if (isOpen) {
            button.setAttribute("data-is-open", "false");
          } else {
            button.setAttribute("data-is-open", "true");
          }

          createRoot(reviewContainer).render(
            <QueryClientProvider client={queryClient}>
              <ReviewContainer
                isOpen={!isOpen}
                diffHtml={parsedDiffHtml}
                file={fileName}
              />
            </QueryClientProvider>
          );
        };
      }
    }
  }, [fileHeadersLength]);

  return null;
};

// Function to process the GitHub Pull Request page, and render the AIReviewButton component
let rootElement: HTMLDivElement | null = null;
const processGithubPullRequestPage = async () => {
  if (!rootElement || !document.body.contains(rootElement)) {
    rootElement = document.createElement("div");
    document.body.appendChild(rootElement);
  }

  createRoot(rootElement).render(<AIReviewButton />);

  /* Add a watcher to detect changes in the DOM, and re-render the AIReviewButton component if it's not present */
  domUpdateWatcher(processGithubPullRequestPage, 50);
};

// Call the function to process the GitHub page initially
void processGithubPullRequestPage();
