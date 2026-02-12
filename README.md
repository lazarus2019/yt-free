# YT Free - Ad-Free Music Player

A YouTube Music-inspired web application built with modern React and TypeScript.

## 🚀 Features

- **🔐 Google OAuth Authentication** - Sign in with your Google account
- **🔍 Search** - Search for songs and videos with debounced input
- **📋 Playlists** - Create, edit, and manage playlists
- **👥 Collaboration** - Share playlists and collaborate with others
- **🎵 Music Player** - Full-featured player with queue management
- **🌙 Dark Theme** - Beautiful dark UI inspired by YouTube Music
- **📱 Responsive** - Desktop-first responsive design

## 🛠️ Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **@tanstack/react-query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **@react-oauth/google** - Google OAuth integration
- **Lucide React** - Beautiful icons

## 📁 Project Structure

\`\`\`
src/
├── app/                    # App configuration
│   ├── router.tsx          # Route definitions
│   └── providers.tsx       # Context providers
├── components/
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── ...
├── features/               # Feature modules
│   ├── auth/               # Authentication
│   ├── search/             # Search functionality
│   ├── playlist/           # Playlist management
│   └── player/             # Music player
├── hooks/                  # Custom React hooks
├── pages/                  # Page components
├── services/               # API services
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
└── utils/                  # Utility functions
\`\`\`

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd yt-free
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Add your Google OAuth Client ID:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add \`http://localhost:5173\` to authorized JavaScript origins
   - Copy the Client ID to \`.env\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:5173](http://localhost:5173)

## 📝 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## 🎨 Features in Detail

### Authentication
- Google OAuth 2.0 integration
- Persistent auth state with Zustand
- Protected routes for authenticated features

### Search
- Debounced search input (300ms)
- Search suggestions
- Results with play/add to queue actions

### Playlists
- Create, edit, delete playlists
- Add/remove tracks
- Collaborative playlists with roles (owner/collaborator/viewer)
- Share via public links

### Music Player
- Play/pause, next/previous
- Progress bar with seeking
- Volume control with mute
- Shuffle and repeat modes (none/all/one)
- Queue management

## 🔒 Security

- No hardcoded secrets
- Secure token handling
- Environment variables for sensitive config

## 📄 License

MIT License
