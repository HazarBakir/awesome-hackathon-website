# GitReads

<div align="center">
  <img src="public/papyr-logo-light.png" alt="GitReads Logo" width="120" />
  
  <p align="center">
    <strong>Discover README Files, Reimagined</strong>
  </p>
  
  <p align="center">
    Transform GitHub documentation into a beautifully organized reading experience
  </p>

  <p align="center">
    <a href="https://github.com/HazarBakir/git-reads/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
    </a>
    <a href="https://github.com/HazarBakir/git-reads/stargazers">
      <img src="https://img.shields.io/github/stars/HazarBakir/git-reads" alt="Stars" />
    </a>
    <a href="https://github.com/HazarBakir/git-reads/network/members">
      <img src="https://img.shields.io/github/forks/HazarBakir/git-reads" alt="Forks" />
    </a>
  </p>
</div>

---

## About

GitReads transforms GitHub README files into beautifully formatted, easy-to-navigate documentation with intelligent table of contents, advanced search, and a clean interface.

## Features

- **Smart Navigation** - Auto-generated table of contents with collapsible sections
- **Advanced Search** - Real-time search through documentation
- **Branch Switching** - View README files from different branches
- **Session Management** - Secure 30-minute sessions with activity tracking
- **Full Markdown Support** - Code highlighting, tables, images, links, and more
- **Responsive Design** - Optimized for all devices

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix UI
- React Router DOM
- react-markdown with GFM support
- Supabase (PostgreSQL)
- Framer Motion
- Vite

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- GitHub Personal Access Token (optional, for higher rate limits)

### Installation

1. Clone and install:

```bash
git clone https://github.com/HazarBakir/git-reads.git
cd git-reads
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Optional: GitHub token for higher API rate limits
VITE_GITHUB_TOKEN=your_github_token

# Optional: Only needed if you want to test session management locally
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run development server:

```bash
npm run dev
```

4. Open `http://localhost:5173`

### Database Setup (Optional)

Most contributors don't need database access for local development. However, if you want to test session management features locally:

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** in your project dashboard
4. Copy the contents of `database/schema.sql` and run it
5. Get your project URL and anon key from **Project Settings → API**
6. Add them to your `.env` file

**Note**: All pull requests are automatically deployed to Vercel with full database access for testing.

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. Enter a GitHub repository URL (e.g., `https://github.com/happyhackingspace/awesome-hackathon`)
2. Navigate using the sidebar table of contents
3. Search for specific content with the search bar
4. Switch branches via the branch dropdown

## Contributing

We welcome contributions! Here's how to get started:

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes
4. Commit with clear messages:

```bash
git commit -m "Add: feature description"
```

5. Push to your fork:

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Use TypeScript with proper typing
- Test on multiple browsers and screen sizes
- Write clear, descriptive commit messages
- Ensure components are accessible and responsive

### Testing Your Changes

**Local Testing**: Most UI/UX changes can be tested locally without database setup.

**Full Feature Testing**: Push your PR to automatically deploy a preview on Vercel with complete database access. This is the recommended way to test session management and other backend features.

### Project Structure

```
git-reads/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (GitHub API, Supabase)
│   ├── pages/           # Page components
│   ├── types/           # TypeScript definitions
│   └── utils/           # Helper functions
├── database/            # Database schema
└── public/              # Static assets
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- **Repository**: [github.com/HazarBakir/git-reads](https://github.com/HazarBakir/git-reads)
- **Issues**: [github.com/HazarBakir/git-reads/issues](https://github.com/HazarBakir/git-reads/issues)
- **Pull Requests**: [github.com/HazarBakir/git-reads/pulls](https://github.com/HazarBakir/git-reads/pulls)

---

<div align="center">
  <p> Made with ❤️ </p>
</div>
