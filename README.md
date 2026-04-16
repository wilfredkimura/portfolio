# Portfolio - Kimura Mutahi

A modern, full-stack portfolio application designed for high performance and seamless deployment on Vercel.

## 🚀 Features

- **Project Gallery**: Dynamically synced with GitHub repos using a refined backend proxy.
- **Releases Page**: Automatically fetches latest releases, binaries, and version history from GitHub.
- **Serverless Backend**: Node.js Express server running as an optimized Vercel serverless function.
- **Responsive Design**: Premium mobile experience with a dedicated, labeled navigation bar.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Lucide Icons, Vanilla CSS
- **Backend**: Express.js (Node.js)
- **Deployment**: Vercel (Serverless)

## 📦 Getting Started

### Local Development

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   This starts the Vite client and the Express server concurrently.

### Deployment

This project is optimized for **Vercel**:

1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the configuration in `vercel.json`.
3. Set your environment variables (optional but recommended for higher GitHub API rate limits):
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token.

## 📂 Project Structure

- `api/`: Root-level API mappings (handled via `vercel.json`).
- `client/`: React frontend application.
- `server/`: Express backend logic and serverless entry point.
- `index.html`: Static backup version of the portfolio.
