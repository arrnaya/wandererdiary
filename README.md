# WandererDiary

> **Explore. Experience. Express.**
>
> A community for travel lovers and storytellers.

WandererDiary is a full-stack blogging platform built with **Next.js 15**, **Payload CMS 3.x**, and **PostgreSQL**. It features AI-augmented content creation, a subscriber ecosystem with favorites and AI-moderated comments, author chat, and a Phase II Web3 community with ERC20 tokens and NFT minting.

---

## Features

### Core Platform
- **Home, Stories, Destinations, Tips, About, Contact, Authors** pages
- **Write a Story** — 4-step wizard with AI enhancement pipeline
- **Story Cards** — Featured, horizontal, and default variants
- **Search** — Meilisearch integration ready
- **SEO** — Auto-generated meta tags, JSON-LD structured data

### Subscriber Features
- **Save Favorites** — Bookmark stories to your dashboard
- **AI-Moderated Comments** — Comments are reviewed by AI for obscenity/harmful content before publishing
- **Chat with Authors** — Direct messaging between readers and authors

### Phase II: Wanderlust Community
- **Photo/Video Posts** — Share travel moments with the community
- **AI Content Review** — Posts are scored for originality and helpfulness
- **Nomad ERC20 Tokens** — Earn tokens based on AI review scores
- **Leaderboard** — Top contributors ranked by quality and engagement
- **NFT Minting** — Community images minted as NFTs on Ethereum
- **IPFS Storage** — Assets pinned permanently so they never get lost
- **Wallet Integration** — Add NFTs directly to your wallet from your dashboard

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 + React 19 |
| CMS | Payload 3.x |
| Database | PostgreSQL + Drizzle ORM |
| Styling | Tailwind CSS + shadcn/ui |
| Fonts | Playfair Display + Inter |
| AI | Anthropic Claude + OpenAI GPT-4o |
| Search | Meilisearch |
| Queue | BullMQ + Redis |
| Blockchain | Ethers.js + Hardhat |
| Storage | Cloudflare R2 / S3 |

---

## Project Structure

```
wandererdiary/
├── apps/
│   ├── web/                    # Next.js + Payload application
│   │   ├── app/
│   │   │   ├── (frontend)/     # Public pages
│   │   │   │   ├── page.tsx    # Home
│   │   │   │   ├── stories/
│   │   │   │   ├── destinations/
│   │   │   │   ├── tips/
│   │   │   │   ├── authors/
│   │   │   │   ├── about/
│   │   │   │   ├── contact/
│   │   │   │   ├── write/
│   │   │   │   ├── community/  # Phase II
│   │   │   │   └── dashboard/  # User dashboard
│   │   │   ├── api/            # API routes
│   │   │   └── (payload)/      # Payload admin
│   │   ├── collections/        # Payload CMS collections
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── story/          # StoryCard, etc.
│   │   ├── lib/
│   │   │   ├── ai/             # AI enhancement, SEO, moderation
│   │   │   └── web3/           # Contracts, IPFS
│   │   └── payload.config.ts
│   └── contracts/              # Smart contracts
│       ├── NomadToken.sol      # ERC20 token
│       ├── WandererNFT.sol     # ERC721 NFT
│       └── scripts/deploy.ts
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Meilisearch (optional, for search)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.local.example apps/web/.env.local
# Edit .env.local with your credentials

# Run database migrations
pnpm payload migrate:dev

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URI=postgresql://user:password@localhost:5432/wandererdiary
PAYLOAD_SECRET=your-secret-key

# AI
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Media (Cloudflare R2)
R2_BUCKET=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=...

# Blockchain
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=0x...
NEXT_PUBLIC_NOMAD_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...

# IPFS
IPFS_API_KEY=...
IPFS_API_SECRET=...
```

---

## Smart Contracts

### Deploy

```bash
cd apps/contracts
pnpm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

### NomadToken (ERC20)
- **Symbol**: NOMAD
- **Max Supply**: 100,000,000
- **Reward Pool**: 40,000,000 for community
- Will be listed on Uniswap in 6 months

### WandererNFT (ERC721)
- **Symbol**: WANDERER
- Metadata stored on IPFS
- Images permanently pinned
- Minted via authorized backend wallet

---

## AI Features

| Feature | Description |
|---------|-------------|
| Story Enhancement | Polishes writing while preserving author voice |
| SEO Auto-Optimization | Generates meta title, description, keywords |
| SEO Scoring | 0-100 score with actionable suggestions |
| Smart Tagging | Auto-detects up to 5 relevant tags |
| Comment Moderation | AI reviews for harmful/obscene content |
| Community Review | Scores posts for originality & helpfulness |

---

## License

MIT
