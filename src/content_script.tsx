import logo from "./assets/logo.png";
import { createRoot } from "react-dom/client";
import { domUpdateWatcher } from "./utils/dom_update_watcher";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { extractGitHubPRDetails } from "./utils/extract_github_pr_details";
import { fetchGithubPRTitleAndDescription } from "./fetchers/fetch_github_pr_description";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { sendOpenAiReview } from "./fetchers/send_open_ai_review";
import { domChangeWatcher } from "./utils/dom_change_watcher";

const queryClient = new QueryClient();

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  diffHtml: string;
  file: string;
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

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  diffHtml,
  file,
}: ReviewModalProps) => {
  const githubPrDetails = extractGitHubPRDetails(window.location.href);

  const {
    data: prReviewData,
    isLoading,
    isError,
  } = useQuery(
    ["githubPrDescription", window.location.href],
    () => fetchGithubPRTitleAndDescription(githubPrDetails),
    {
      enabled: isOpen,
    }
  );

  const {
    data: AIReviewData,
    isLoading: isAIReviewLoading,
    isError: isAIReviewError,
  } = useQuery(
    ["openAiReview", file],
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

  return createPortal(
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "80%",
          height: "80%",
          margin: "10% auto",
          padding: "20px",
        }}
      >
        <h1>AI Review</h1>
        <div style={{ height: "80%", overflow: "auto" }}>
          <p>Analyzing code changes...</p>
          <pre>{diffHtml}</pre>
          <p>PR Data:</p>
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error fetching PR description</p>}
          {prReviewData ? (
            <>
              <h2>{prReviewData.title}</h2>
              <pre>{prReviewData.description}</pre>
            </>
          ) : null}
          <p>AI Review:</p>
          {isAIReviewLoading && <p>Loading...</p>}
          {isAIReviewError && <p>Error fetching AI review</p>}
          {AIReviewData ? <pre>{AIReviewData}</pre> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button id="ai-review-close-button" onClick={onClose}>
            Close
          </button>
          <button id="ai-review-submit-button" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const AIReviewButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [diffHtml, setDiffHtml] = useState("");
  const [file, setFile] = useState("");

  const [fileHeadersLength, setFileHeadersLength] = useState(
    document.querySelectorAll("#files .file .file-header").length || 0
  );

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

  const openModal = (fileIndex: number) => {
    const fileDiff =
      document.querySelectorAll(".js-file-content")[fileIndex].innerHTML;

    const parsedDiffHtml = parseHtmlToGitDiff(fileDiff);

    const fileName =
      document.querySelectorAll(".file-info a")[fileIndex].textContent || "";

    setFile(fileName);
    setDiffHtml(parsedDiffHtml);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const submitModal = () => {
    alert("Submit");
    closeModal();
  };

  useEffect(() => {
    console.log("useEffect!!!");
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
        button.onclick = async () => {
          const fileIndex = parseInt(button.getAttribute("data-index") || "0");
          openModal(fileIndex);
        };
        fileActions.prepend(button);
      }
    }
  }, [fileHeadersLength]);

  return createPortal(
    <QueryClientProvider client={queryClient}>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submitModal}
        diffHtml={diffHtml}
        file={file}
      />
    </QueryClientProvider>,

    document.body
  );
};

const processGithubPage = async () => {
  console.log("processGithubPage!!!");

  const rootElement = document.createElement("div");
  document.body.appendChild(rootElement);
  createRoot(rootElement).render(<AIReviewButton />);

  domUpdateWatcher(processGithubPage, 50);
};

// Call the function to process the GitHub page initially
void processGithubPage();
