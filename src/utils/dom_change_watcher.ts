export const domChangeWatcher = (
  selector: string,
  callback: () => void,
  delayInMs = 0
) => {
  let oldLength = document.querySelectorAll(selector).length;

  const observer = new MutationObserver(() => {
    const newLength = document.querySelectorAll(selector).length;

    if (oldLength === newLength) {
      return;
    }

    oldLength = newLength;
    setTimeout(callback, delayInMs);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
};
