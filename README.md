# TaleVista - AI Story Generator

An advanced AI-powered story generation platform that creates captivating stories with beautiful illustrations using Gemini AI, Replicate, and fal.ai.

## Features

### Core Features
- 🎨 **AI Story Generation** - Generate unique stories using Google's Gemini AI
- 🖼️ **Image Generation** - Create stunning illustrations with Replicate and fal.ai
- 👥 **Character Management** - Design consistent characters with AI-generated portraits
- 📖 **Multi-Chapter Stories** - Build complex narratives with multiple chapters
- 💳 **Subscription System** - Stripe-powered payment integration
- 🔐 **Authentication** - Secure login with NextAuth (Google OAuth & Email/Password)
- 📱 **Responsive Design** - Beautiful UI built with Tailwind CSS and Shadcn/ui

### Advanced Features (NEW!)
- 📄 **PDF Export** - Export your stories as professionally formatted PDFs
- 🔊 **Voice Narration** - Generate AI voice narration with ElevenLabs (9+ voices)
- 📚 **Story Templates** - 8 pre-built templates across various genres
- 🤝 **Collaboration** - Invite co-authors and collaborate on stories
- 🌐 **Social Sharing** - Share stories on Twitter, Facebook, WhatsApp
- 📊 **Analytics Dashboard** - Track views, likes, and engagement metrics
- 🎨 **Image Editor** - Advanced image editing (brightness, contrast, saturation, rotation)
- 🏛️ **Community Gallery** - Discover and explore public stories
- 🧠 **AI Customization** - Fine-tune AI behavior and writing style
- 💬 **Comments** - Comment on stories and chapters
- ❤️ **Likes & Views** - Social engagement features

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **AI Services**:
  - Google Gemini AI (Story generation)
  - Replicate (Image generation)
  - fal.ai (Fast image generation)
  - ElevenLabs (Voice narration)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys for:
  - Google Gemini AI
  - Replicate
  - fal.ai
  - ElevenLabs
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

# Stripe (Your key is already configured)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI Services
GEMINI_API_KEY="your-gemini-api-key"
REPLICATE_API_TOKEN="your-replicate-token"
FAL_KEY="your-fal-api-key"
ELEVENLABS_API_KEY="your-elevenlabs-api-key"

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
├── app/                     # Next.js app directory
│   ├── api/                # API routes
│   │   ├── auth/          # Authentication
│   │   ├── story/         # Story management
│   │   ├── character/     # Character generation
│   │   ├── image/         # Image generation
│   │   ├── audio/         # Voice narration
│   │   ├── analytics/     # Analytics data
│   │   ├── gallery/       # Public gallery
│   │   └── stripe/        # Payment handling
│   ├── auth/              # Auth pages
│   ├── dashboard/         # User dashboard
│   ├── story/             # Story pages
│   ├── analytics/         # Analytics dashboard
│   ├── gallery/           # Community gallery
│   └── settings/          # Settings pages
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── story/            # Story components
├── lib/                  # Utility functions
│   ├── ai/              # AI integrations
│   ├── audio/           # Audio generation
│   ├── pdf/             # PDF export
│   ├── templates/       # Story templates
│   ├── stripe/          # Stripe integration
│   └── db/              # Database client
├── prisma/              # Prisma schema
└── public/              # Static files
\`\`\`

## Features Overview

### Story Templates
Choose from 8 professionally crafted templates:
- Epic Fantasy Quest
- Space Adventure
- Mystery Thriller
- Romantic Drama
- Horror Survival
- Historical Epic
- Cyberpunk Noir
- Coming of Age

### Voice Narration
Generate audio narration with 9+ AI voices:
- Rachel - Calm Female
- Antoni - Well-Rounded Male
- Josh - Deep Male
- Bella - Soft Female
- And 5+ more options

### Analytics Dashboard
Track your story performance with:
- Total views and likes
- Engagement rate
- Views over time (line chart)
- Stories by genre (pie chart)
- Top performing stories

### Community Gallery
- Discover public stories
- Filter by genre
- Sort by trending, recent, popular, or most liked
- Like and view stories
- Search functionality

### Image Editor
Advanced editing tools:
- Brightness control (0-200%)
- Contrast adjustment (0-200%)
- Saturation control (0-200%)
- 90° rotation
- Download edited images

### Collaboration Features
- Invite co-authors
- Role-based permissions (owner, editor, viewer)
- Comments on stories and chapters
- Track collaborator activity

## API Routes

### Story Management
- `POST /api/story/generate` - Generate new story
- `GET /api/story` - List user stories
- `GET /api/story/[id]` - Get story details
- `POST /api/story/[id]/chapter` - Generate chapter
- `GET /api/story/[id]/export` - Export story data
- `POST /api/story/[id]/like` - Like/unlike story

### Media Generation
- `POST /api/image/generate` - Generate images
- `POST /api/character/generate` - Create characters
- `POST /api/audio/generate` - Generate narration

### Social & Analytics
- `GET /api/analytics` - User analytics
- `GET /api/gallery` - Public story gallery

### Settings
- `POST /api/settings/ai` - Save AI preferences

## Subscription Plans

- **Free**: 5 stories/month, 10 images/month
- **Pro ($9.99/month)**:
  - Unlimited stories
  - 100 images/month
  - PDF export
  - No watermarks
  - Priority support

- **Premium ($29.99/month)**:
  - Everything in Pro
  - Unlimited images
  - Custom AI models
  - Voice narration
  - API access
  - White-label export

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

## Deployment

### Environment Variables
Make sure all environment variables are set in your deployment platform:
- Database URL
- API keys for all services
- NextAuth configuration
- Stripe keys

### Database
- Run migrations: `npx prisma migrate deploy`
- Generate client: `npx prisma generate`

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

For support, please open an issue in the GitHub repository or contact the development team.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time collaboration with WebSockets
- [ ] Custom model training interface
- [ ] Story versioning and revision history
- [ ] Advanced story templates marketplace
- [ ] Multi-language support
- [ ] Story import from other formats
- [ ] Enhanced SEO for public stories
- [ ] Story contests and challenges
- [ ] Author profiles and portfolios
