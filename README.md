# Chat with Website

An AI-powered application that allows you to have conversations with any webpage content. Available as both a web application and a Chrome browser extension.

## Features

- **Web Application**: Load any webpage URL and chat with its content using AI
- **Chrome Extension**: Chat with the current webpage you're browsing
- **Content Extraction**: Automatically extracts and processes webpage content using Mozilla Readability
- **AI-Powered Chat**: Uses OpenAI's API for intelligent conversations about webpage content
- **Question Suggestions**: Automatically generates relevant questions about the webpage content
- **Modern UI**: Built with React, Next.js, and shadcn/ui components

## Architecture

This is a monorepo containing:

- **`apps/web/`**: Next.js web application
- **`apps/extension/`**: Chrome browser extension built with Vite and React
- **`packages/ui/`**: Shared UI components built with shadcn/ui

## Prerequisites

- Node.js >= 22
- pnpm == 9
- OpenAI API key

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/mikr13/chat-with-site.git
   cd chat-with-site
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   Create environment files for the web app:

   ```bash
   # In apps/web/.env.local or apps/web/.env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Running the Projects

### Development Mode

Run both applications in development mode:

```bash
pnpm dev
```

This will start:

- Web app at `http://localhost:3000`
- Extension build in watch mode

### Individual Applications

**Web Application**:

```bash
cd apps/web
pnpm dev
```

**Chrome Extension**:

```bash
cd apps/extension
pnpm dev
```

### Production Build

Build all applications:

```bash
pnpm build
```

Build individual applications:

```bash
# Web app
cd apps/web
pnpm build

# Extension
cd apps/extension
pnpm build
```

## Chrome Extension Installation

1. Build the extension:

   ```bash
   cd apps/extension
   pnpm build
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the `apps/extension/dist` folder

5. The extension will appear in your browser toolbar

## API Endpoints

The web application provides the following API endpoints:

- `POST /api/chat` - Main chat endpoint for AI conversations
- `POST /api/extract-content` - Extract content from a webpage URL
- `POST /api/suggest-questions` - Generate suggested questions for webpage content

## Technology Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **AI Integration**: OpenAI API, Vercel AI SDK
- **Content Processing**: Mozilla Readability, jsdom
- **Build Tools**: Vite (extension), Turbo (monorepo)
- **Package Manager**: pnpm

## Project Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all applications
pnpm lint             # Lint all applications
pnpm format           # Format code with Prettier

# Type checking
pnpm typecheck        # Type check all applications
```

## Adding Components

To add new shadcn/ui components to the web app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are automatically placed in the shared `packages/ui/src/components` directory and can be imported as:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
