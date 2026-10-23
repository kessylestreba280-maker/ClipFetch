# ClipFetch - Video Link Tool

## About the Project

ClipFetch is a simple, fast, and responsive web application that helps users analyze video links and identify supported platforms.

## Live Website

https://clipfetch.devs.li

## Features

- Responsive user interface
- Video URL validation
- Platform detection for YouTube, TikTok, Facebook, and Instagram
- Direct video link preview when supported by the video URL and browser
- Express.js backend
- Basic API health check

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- Helmet

## How to Run Locally

1. Install Node.js.
2. Clone or download this repository.
3. Open a terminal in the project folder.
4. Install the dependencies:

   `npm install`

5. Start the application using the start script configured in `package.json`:

   `npm start`

6. Open `http://localhost:3000` in your browser.

## API Health Check

Open `http://localhost:3000/api/health` while the local server is running to check the backend status.

## Limitations

Platform detection does not guarantee that every video can be played or downloaded. Direct video previews depend on the source URL, browser support, and the source server's permissions. This project does not guarantee downloads from social media platforms.

## Author

Student Capstone Project
