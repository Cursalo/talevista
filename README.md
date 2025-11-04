# TaleVista - AI Story Generator

An advanced AI-powered story generation platform that creates captivating stories with beautiful illustrations using Gemini AI, Replicate, and fal.ai.

## Features

- 🎨 **AI Story Generation** - Generate unique stories using Google's Gemini AI
- 🖼️ **Image Generation** - Create stunning illustrations with Replicate and fal.ai
- 👥 **Character Management** - Design consistent characters with AI-generated portraits
- 📖 **Multi-Chapter Stories** - Build complex narratives with multiple chapters
- 💳 **Subscription System** - Stripe-powered payment integration
- 🔐 **Authentication** - Secure login with NextAuth (Google OAuth & Email/Password)
- 📱 **Responsive Design** - Beautiful UI built with Tailwind CSS and Shadcn/ui

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **AI Services**:
  - Google Gemini AI (Story generation)
  - Replicate (Image generation)
  - fal.ai (Fast image generation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys for:
  - Google Gemini AI
  - Replicate
  - fal.ai
  - Stripe
  - Google OAuth (optional)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd talevista
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your configuration:
\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/talevista"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI Services
GEMINI_API_KEY="your-gemini-api-key"
REPLICATE_API_TOKEN="your-replicate-token"
FAL_KEY="your-fal-api-key"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
\`\`\`

4. Set up the database:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
talevista/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # User dashboard
│   ├── story/           # Story pages
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── story/          # Story-related components
│   └── character/      # Character components
├── lib/                # Utility functions
│   ├── ai/             # AI service integrations
│   ├── stripe/         # Stripe integration
│   ├── db/             # Database client
│   └── auth/           # Auth configuration
├── prisma/             # Prisma schema
└── public/             # Static files
\`\`\`

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/story/generate` - Generate new story
- `/api/story/[storyId]/chapter` - Chapter management
- `/api/character/generate` - Character creation
- `/api/image/generate` - Image generation
- `/api/stripe/*` - Payment endpoints

## Subscription Plans

- **Free**: 5 stories/month, 10 images/month
- **Pro**: Unlimited stories, 100 images/month, $9.99/month
- **Premium**: Unlimited everything, custom models, $29.99/month

## Development

### Database Migrations

\`\`\`bash
npx prisma migrate dev
npx prisma studio  # View database
\`\`\`

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is proprietary software.

## Support

For support, please open an issue in the GitHub repository.
