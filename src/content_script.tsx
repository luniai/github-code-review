import logo from "./assets/logo.jpg";
import { createRoot } from "react-dom/client";
import { domUpdateWatcher } from "./utils/dom_update_watcher";
import { useEffect, useState } from "react";
import { extractGitHubPRDetails } from "./utils/extract_github_pr_details";
import { fetchGithubPRTitleAndDescription } from "./fetchers/fetch_github_pr_description";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { sendOpenAiReview } from "./fetchers/send_open_ai_review";
import { domChangeWatcher } from "./utils/dom_change_watcher";

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

function parseHtmlToGitDiff(htmlString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const rows = doc.querySelectorAll("tbody tr");

  const diffLines: string[] = [];

  rows.forEach((row) => {
    const additionCell = row.querySelector(".blob-code-addition");
    const deletionCell = row.querySelector(".blob-code-deletion");
    const contextCell = row.querySelector(".blob-code-context");
    const hunkHeaderCell = row.querySelector(".blob-code-hunk");
    const innerCell = row.querySelector(".blob-code-inner");

    if (hunkHeaderCell?.textContent) {
      diffLines.push(hunkHeaderCell.textContent.trim());
    } else if (additionCell?.textContent) {
      diffLines.push(`+${additionCell.textContent.trim()}`);
    } else if (deletionCell?.textContent) {
      diffLines.push(`-${deletionCell.textContent.trim()}`);
    } else if (contextCell?.textContent) {
      diffLines.push(` ${contextCell.textContent.trim()}`);
    } else if (innerCell?.textContent) {
      diffLines.push(` ${innerCell.textContent.trim()}`);
    }
  });

  return diffLines.join("\n");
}

// eslint-disable-next-line react-refresh/only-export-components
const ReviewContainer = ({ isOpen, diffHtml, file }: ReviewContainerProps) => {
  const githubPrDetails = extractGitHubPRDetails(window.location.href);

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
    [OPEN_AI_REVIEW_QUERY_KEY, file],
    () =>
      sendOpenAiReview({
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
      {AIReviewData ? <pre>{AIReviewData}</pre> : null}
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
const processGithubPullRequestPage = async () => {
  const rootElement = document.createElement("div");
  document.body.appendChild(rootElement);
  createRoot(rootElement).render(<AIReviewButton />);

  /* Add a watcher to detect changes in the DOM, and re-render the AIReviewButton component if it's not present */
  domUpdateWatcher(processGithubPullRequestPage, 50);
};

// Call the function to process the GitHub page initially
void processGithubPullRequestPage();
