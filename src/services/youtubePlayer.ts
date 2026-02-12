/**
 * YouTube IFrame Player API wrapper
 * Handles loading the IFrame API script
 * Types are declared in src/types/youtube.d.ts
 */

let apiLoaded = false;
let apiLoading = false;
const readyCallbacks: (() => void)[] = [];

/**
 * Load the YouTube IFrame API script
 * Returns a promise that resolves when the API is ready
 */
export function loadYouTubeAPI(): Promise<void> {
  if (apiLoaded && window.YT?.Player) {
    return Promise.resolve();
  }

  if (apiLoading) {
    return new Promise((resolve) => {
      readyCallbacks.push(resolve);
    });
  }

  apiLoading = true;

  return new Promise((resolve) => {
    readyCallbacks.push(resolve);

    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      apiLoading = false;
      readyCallbacks.forEach((cb) => cb());
      readyCallbacks.length = 0;
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });
}
