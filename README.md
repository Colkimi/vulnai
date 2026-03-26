# VulnAI Frontend

A modern React + TypeScript chatbot interface for the VulnAI Security Assistant API. This frontend provides an intuitive interface for asking security questions, analyzing CVEs, and learning about vulnerabilities.

## Features

✨ **Key Features:**
- 💬 Real-time chat interface with conversation history
- 🔐 Session management with automatic persistence
- 📊 Support for real-world security scenarios (phishing, attachment safety, etc.)
- 🔍 CVE search and analysis
- 📱 Responsive design for all devices
- ⌨️ Markdown rendering for rich responses
- 📝 Additional context support for better answers
- 🎨 Modern, intuitive UI with emoji indicators

## Prerequisites

- Node.js 16+ and npm/pnpm
- VulnAI Backend API running at `http://localhost:3000`

## Installation

1. **Clone the repository**
   ```bash
   cd vulnai-front
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   Or with npm:
   ```bash
   npm install
   ```

3. **Verify backend is running**
   ```bash
   # The backend should be accessible at http://localhost:3000
   curl http://localhost:3000/chat/help
   ```

## Configuration

The frontend is pre-configured to connect to the backend at `http://localhost:3000`. If your backend runs on a different URL, update it in:

**File:** `src/hooks/useVulnAIChat.ts`
```typescript
const API_BASE_URL = 'http://localhost:3000'; // Change this if needed
```

## Development

### Start Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:5173/`

### Hot Module Replacement (HMR)
Changes to the code will automatically reload in the browser during development.

## Building

### Build for Production
```bash
pnpm build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── Chat.tsx              # Main chat interface component
│   └── ChatMessage.tsx       # Individual message display component
├── hooks/
│   └── useVulnAIChat.ts      # Custom hook for API interactions
├── styles/
│   ├── Chat.css              # Chat component styles
│   ├── ChatMessage.css       # Message component styles
│   └── globals.css           # Global styles
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Base styles
```

## Usage Guide

### Getting Started

1. **Open the App** - Navigate to `http://localhost:5173/`
2. **Ask a Question** - Type your security question in the input field
3. **Add Context** - Click the **ℹ️** button to add optional context
4. **Get Response** - Click **📤** or press Enter to send

### Example Questions

#### Email Safety
```
Is this email safe? 
Context: It says my account has suspicious activity
```

#### CVE Search
```
CVE-2024-1234
```

#### Product Vulnerabilities
```
Apache vulnerabilities
```

#### General Security
```
How do I secure my account?
```

### Session Management

- **Automatic Sessions**: A session ID is created automatically on first message
- **Session Persistence**: Sessions are saved in browser's localStorage
- **Continue Conversation**: Close and reopen the app to continue the same session
- **Clear Chat**: Click **🗑️** to start a new conversation
- **Session Duration**: Sessions expire after 30 minutes of inactivity on the backend

## Supported Vulnerability Types

- **email_trust** - Email safety and legitimacy
- **phishing** - Phishing attack detection
- **link_safety** - URL safety analysis
- **attachment_safety** - File attachment assessment
- **website_trust** - Website legitimacy
- **social_engineering** - Social engineering detection
- **password_breach** - Password compromise help
- **account_security** - Account protection advice
- **general** - Any security question

## Troubleshooting

### Backend Not Responding

**Error:** "Failed to send message"

**Solution:**
1. Verify backend is running: `curl http://localhost:3000/chat/help`
2. Check backend logs for errors
3. Ensure CORS is enabled on backend if accessing from different domain

### Session Not Persisting

**Error:** Session ID changes on refresh

**Solution:**
1. Check if browser allows localStorage
2. Verify you're on the same domain
3. Check browser's privacy settings

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
pnpm build
# Upload the dist/ folder to Netlify
```

### Deploy to Traditional Server

```bash
pnpm build
# Copy dist/ folder to your web server
```

**Important:** Make sure your backend API is accessible from the deployment domain.

## License

This project is licensed as specified in the backend repository.

