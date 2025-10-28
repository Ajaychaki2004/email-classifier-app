# Gmail AI Sorter

A web application that allows users to log in using Google OAuth, fetch their recent emails from Gmail, and classify them into categories using OpenAI GPT-4o.

## Features

- **User Authentication**: Secure login using Google OAuth via NextAuth.js.
- **Email Fetching**: Retrieve the last 15 emails (configurable) from the user's Gmail account using the Gmail API.
- **Email Classification**: Automatically classify emails into categories such as Important, Promotional, Social, Marketing, Spam, or General using OpenAI GPT-4o.
- **Local Storage**: Store OpenAI API key and fetched emails in the browser's local storage for privacy.
- **Responsive UI**: Built with Next.js and Tailwind CSS for a modern, responsive design.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, Express.js (for additional backend logic)
- **Authentication**: NextAuth.js with Google OAuth
- **APIs**: Gmail API, OpenAI GPT-4o
- **Libraries**: Langchain.js for AI integration
- **Other**: TypeScript, ESLint

## Prerequisites

Before running the application, ensure you have the following:

- Node.js (version 18 or higher)
- npm or yarn
- A Google Cloud Console project with Gmail API enabled
- An OpenAI API account

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ajaychaki2004/email-classifier-app.git
   cd email-classifier-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see Environment Variables section below).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Run the backend server (in a separate terminal):
   ```bash
   cd backend
   node server.js
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI (optional, as it's entered by user)
OPENAI_API_KEY=your-openai-api-key
```

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the Gmail API:
   - Navigate to "APIs & Services" > "Library".
   - Search for "Gmail API" and enable it.
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials".
   - Click "Create Credentials" > "OAuth 2.0 Client IDs".
   - Set the application type to "Web application".
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs.
5. Copy the Client ID and Client Secret to your `.env.local` file.

### Setting up OpenAI

1. Sign up for an account at [OpenAI](https://platform.openai.com/).
2. Generate an API key from your dashboard.
3. The app prompts users to enter their own OpenAI API key, which is stored in localStorage. However, you can set a default key in the environment variables if needed.

## Usage

1. **Login**: Click the login button and authenticate with your Google account.
2. **Enter OpenAI Key**: Provide your OpenAI API key in the input field (stored locally).
3. **Fetch Emails**: The app will fetch your last 15 emails from Gmail.
4. **Classify Emails**: Emails are automatically classified and displayed in categories.
5. **View Results**: Browse through the categorized emails in the UI.

## API Endpoints

- `GET /api/auth/[...nextauth]`: NextAuth.js authentication routes.
- `GET /api/emails`: Fetches and classifies emails (requires authentication).

## Project Structure

```
gmail-ai-sorter/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts
│   │   └── emails/
│   │       └── route.ts
│   ├── components/
│   │   └── providers.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── backend/
│   └── server.js
├── utils/
│   └── classify.js
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature.
3. Make your changes and test them.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework.
- [NextAuth.js](https://next-auth.js.org/) for authentication.
- [OpenAI](https://openai.com/) for the GPT-4o model.
- [Google Gmail API](https://developers.google.com/gmail/api) for email access.
