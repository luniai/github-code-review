import logo from "./assets/logo.png";
import { createRoot } from "react-dom/client";
import { domUpdateWatcher } from "./utils/dom_update_watcher";

const reviewModalHTML = () => {
  const modalElement = document.createElement("div");
  modalElement.setAttribute("id", "ai-review-modal");
  modalElement.setAttribute(
    "style",
    "position: fixed; z-index: 1000; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);"
  );

  const contentElement = document.createElement("div");
  contentElement.setAttribute(
    "style",
    "background-color: white; width: 80%; height: 80%; margin: 10% auto; padding: 20px;"
  );

  const titleElement = document.createElement("h1");
  titleElement.innerText = "AI Review";

  const bodyElement = document.createElement("div");
  bodyElement.setAttribute("style", "height: 80%; overflow: auto;");
  bodyElement.innerHTML = `
    <p>Analyzing code changes...</p>
  `;

  const buttonsElement = document.createElement("div");
  buttonsElement.setAttribute(
    "style",
    "display: flex; justify-content: space-between;"
  );

  const closeButton = document.createElement("button");
  closeButton.setAttribute("id", "ai-review-close-button");
  closeButton.innerText = "Close";
  closeButton.onclick = () => {
    modalElement.remove();
  };

  const submitButton = document.createElement("button");
  submitButton.setAttribute("id", "ai-review-submit-button");
  submitButton.innerText = "Submit";
  submitButton.onclick = () => {
    alert("Submit");
  };

  buttonsElement.appendChild(closeButton);
  buttonsElement.appendChild(submitButton);

  contentElement.appendChild(titleElement);
  contentElement.appendChild(bodyElement);
  contentElement.appendChild(buttonsElement);

  modalElement.appendChild(contentElement);

  return modalElement;
};

const processGithubPage = async () => {
  console.log("processGithubPage!!!");
  const hasAiReviewButton = document.getElementById("ai-review-button");
  if (hasAiReviewButton) {
    return;
  }
  const firstFile = document.querySelectorAll("#files .file .file-header")[0];
  if (firstFile) {
    const fileActions = firstFile.querySelectorAll(".file-actions div")[0];
    const button = document.createElement("button");
    button.innerText = "AI-Review";
    button.id = "ai-review-button";
    button.setAttribute(
      "style",
      `background-image: url(${chrome.runtime.getURL(logo)});`
    );
    button.onclick = async () => {
      document.body.appendChild(reviewModalHTML());
    };
    fileActions.prepend(button);
  }

  createRoot(document.createElement("div"));
  domUpdateWatcher(processGithubPage, 50);
};
void processGithubPage();
