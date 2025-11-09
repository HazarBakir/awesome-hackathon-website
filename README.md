# Awesome Hackathon Website

A modern, interactive web application that dynamically displays the [Awesome Hackathon](https://github.com/HappyHackingSpace/awesome-hackathon) repository's README content with an elegant UI and seamless navigation.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.9.5-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

## Overview

This project provides a beautiful, responsive interface for browsing the Awesome Hackathon repository's comprehensive list of tools and resources. The application fetches content directly from GitHub, parses markdown, and presents it with an interactive table of contents and smooth navigation.

## Features

- **Dynamic Content Loading**: Fetches README content directly from GitHub API using Octokit
- **Markdown Rendering**: Full markdown support with React Markdown, including code blocks and syntax highlighting
- **Interactive Table of Contents**: Auto-generated TOC sidebar with smooth scroll navigation
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
- **Modern UI**: Dark theme with gradient backgrounds and subtle grid patterns
- **Emoji Support**: Full emoji rendering including shortcode conversion (`:heart:` → ❤️)
- **Image Handling**: Automatic conversion of relative image paths to GitHub raw URLs
- **Type Safety**: Built with TypeScript for robust development experience

## Tech Stack

- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.7** - Fast build tool and dev server with HMR
- **React Router 7.9.5** - Client-side routing
- **React Markdown 10.1.0** - Markdown rendering engine
- **Octokit 5.0.5** - GitHub API integration
- **Remark Emoji 5.0.2** - Emoji shortcode support

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- GitHub Personal Access Token with `repo` scope

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/awesome-hackathon-website.git

# Navigate to the project directory
cd awesome-hackathon-website

# Install dependencies
npm install

# Create .env file
echo "VITE_GITHUB_TOKEN=your_github_token_here" > .env
```

### Configuration

1. **GitHub Token Setup**:
   - Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scope
   - Add it to `.env` file as `VITE_GITHUB_TOKEN`

2. **Repository Configuration** (Optional):
   - Update `owner` and `repo` in `src/lib/github.ts` to point to a different repository

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

The development server will start at `http://localhost:5173`

## Project Structure

```
awesome-hackathon-website/
├── src/
│   ├── pages/
│   │   ├── Landing/          # Landing page component
│   │   │   ├── Landing.tsx
│   │   │   └── Landing.css
│   │   └── Document/         # Document viewer with TOC
│   │       ├── Document.tsx
│   │       └── Document.css
│   ├── lib/
│   │   ├── github.ts         # GitHub API integration
│   │   └── parser.ts         # Markdown parsing utilities
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # Vite environment types
├── public/                   # Static assets
├── package.json
└── README.md
```

## Architecture

### Document Page

The Document page is the core component that:

- Fetches README content from GitHub API on component mount
- Parses markdown headings to generate table of contents
- Renders markdown with custom React components
- Handles image path conversion for GitHub assets
- Provides smooth anchor navigation with scroll behavior

### Parser Utilities

- **`parseTOC()`**: Extracts all headings from markdown and generates navigation IDs
- **`generateHeadingId()`**: Creates URL-safe IDs from heading text for anchor links

### GitHub Integration

- Uses Octokit SDK for authenticated GitHub API requests
- Fetches README content via repository API endpoint
- Falls back to base64 decoding if raw URL unavailable

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Add `VITE_GITHUB_TOKEN` to environment variables in project settings
3. Deploy automatically on every push to main branch

The app will automatically rebuild when the source repository is updated, ensuring users always see the latest content.

### Other Platforms

The project can be deployed to any static hosting service:

- **Netlify**: Connect GitHub repo and add environment variables
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Cloudflare Pages**: Similar setup to Vercel

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Content sourced from [Awesome Hackathon](https://github.com/HappyHackingSpace/awesome-hackathon)
- Made with ❤️
