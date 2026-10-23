
"use strict";

const linkForm = document.getElementById("linkForm");
const videoUrl = document.getElementById("videoUrl");
const platform = document.getElementById("platform");
const message = document.getElementById("message");
const resultCard = document.getElementById("resultCard");
const videoPreview = document.getElementById("videoPreview");
const previewPlayer = document.getElementById("previewPlayer");

function checkVideoUrl(value) {
  let parsedUrl;

  try {
    parsedUrl = new URL(value);
  } catch {
    return {
      valid: false,
      message: "Invalid URL. Please enter a complete video link."
    };
  }

  if (
    parsedUrl.protocol !== "https:" &&
    parsedUrl.protocol !== "http:"
  ) {
    return {
      valid: false,
      message: "Please use an HTTP or HTTPS link."
    };
  }

  const host = parsedUrl.hostname.toLowerCase();

  if (
    host === "youtube.com" ||
    host.endsWith(".youtube.com") ||
    host === "youtu.be"
  ) {
    return { valid: true, platform: "youtube" };
  }

  if (
    host === "facebook.com" ||
    host.endsWith(".facebook.com") ||
    host === "fb.watch"
  ) {
    return { valid: true, platform: "facebook" };
  }

  if (
    host === "tiktok.com" ||
    host.endsWith(".tiktok.com")
  ) {
    return { valid: true, platform: "tiktok" };
  }

  if (
    host === "instagram.com" ||
    host.endsWith(".instagram.com")
  ) {
    return { valid: true, platform: "instagram" };
  }

  const videoExtensions = [
    ".mp4", ".webm", ".mov", ".m4v"
  ];

  const pathname = parsedUrl.pathname.toLowerCase();

  const isDirectVideo = videoExtensions.some(
    extension => pathname.endsWith(extension)
  );

  if (isDirectVideo) {
    return { valid: true, platform: "direct" };
  }

  return {
    valid: false,
    message:
      "Unsupported video link. Please use YouTube, Facebook, TikTok, Instagram, or a direct video file."
  };
}

function resetVideoPreview() {
  videoPreview.hidden = true;
  previewPlayer.pause();
  previewPlayer.removeAttribute("src");
  previewPlayer.load();
}

previewPlayer.addEventListener("error", () => {
  const errorCode = previewPlayer.error?.code;

  videoPreview.hidden = false;

  switch (errorCode) {
    case 2:
      message.textContent =
        "Network error: The video could not be downloaded. Check the URL and your internet connection.";
      break;

    case 3:
      message.textContent =
        "Video decoding error: The browser could not decode this video.";
      break;

    case 4:
      message.textContent =
        "Unsupported video source: Use a direct video URL with a browser-supported format, such as MP4.";
      break;

    default:
      message.textContent =
        "The video could not be played. Check whether the URL points directly to a playable video file.";
  }
});


previewPlayer.addEventListener("playing", () => {
  message.textContent = "Video is playing successfully!";
});

async function checkBackend() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();

    return response.ok && data.success;
  } catch (error) {
    console.error("Backend connection error:", error);
    return false;
  }
}

if (linkForm) {
  linkForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = videoUrl.value.trim();
    const selectedPlatform = platform.value;

    resultCard.hidden = false;
    resetVideoPreview();
    message.textContent = "Checking your video link...";

    const result = checkVideoUrl(url);

    if (!result.valid) {
      message.textContent = result.message;
      return;
    }

    const detectedPlatform = result.platform;

    if (
      selectedPlatform !== "auto" &&
      selectedPlatform !== detectedPlatform
    ) {
      message.textContent =
        "Platform mismatch. Detected: " +
        detectedPlatform +
        ". Please choose the correct platform or select Auto.";
      return;
    }

    if (detectedPlatform === "direct") {
      videoPreview.hidden = false;
      previewPlayer.src = url;
      previewPlayer.load();

      message.textContent =
        "Direct video link detected. Attempting to load preview...";
    } else {
      message.textContent =
        "Platform detected: " +
        detectedPlatform +
        ". The link format is recognized, but playback has not been verified.";
    }

    const backendIsOnline = await checkBackend();

    if (!backendIsOnline) {
      message.textContent +=
        " Warning: The backend health check failed. Make sure the server is running.";
    }
  });
}
