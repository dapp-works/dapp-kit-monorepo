# dapp-kit-monorepo

> A comprehensive blockchain DApp toolkit monorepo built with Turborepo

## Installation

```bash
pnpm install
```

## About

A monorepo toolkit for building decentralized applications (DApps) with a focus on Ethereum and IoTeX blockchains. It uses [Turborepo](https://turborepo.org/) for efficient build management and contains:

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ next.js
      ├─ Next.js 14 (App Router)
      ├─ React 18
      ├─ Tailwind CSS with NextUI
      ├─ MobX for state management
      ├─ tRPC for type-safe APIs
      ├─ NextAuth for authentication
      └─ RainbowKit for wallet connections
packages
  ├─ dappkit
  │   ├─ Wallet management (RainbowKit, Ledger, Safe App SDK)
  │   ├─ Transaction handling with multi-chain support
  │   ├─ JSON forms with validation (RJSF)
  │   ├─ JSON tables with sorting/filtering
  │   ├─ Metrics dashboards with charts (Tremor React)
  │   ├─ JSON editor with Monaco integration
  │   ├─ MobX-based store system
  │   └─ Developer tools (inspector, toasts, dialogs)
  └─ config
      └─ Shared Tailwind & ESLint configs
```

> In this template, we use `@acme` as a placeholder for package names. You may want to replace it with your own organization or project name.

## Features

### DappKit Package (@dappworks/kit)

The core package providing:

- **Multi-chain wallet support**: Ethereum, BSC, Polygon, and IoTeX
- **Hardware wallet integration**: Ledger support via WebUSB
- **Safe App integration**: Full Safe multisig wallet support
- **Transaction management**: Send transactions, track receipts, handle multiple chains
- **UI Components**:
  - JSON Schema Forms with validation
  - Interactive JSON tables
  - Metrics dashboards with charts
  - Monaco-based JSON editor
- **State management**: MobX stores for wallet, forms, and UI state
- **Auto-connect**: IoPay mobile wallet auto-detection and connection

### Next.js App

A demo application showcasing:

- Next.js 14 with App Router
- Wallet connection with RainbowKit
- tRPC for type-safe client-server communication
- NextAuth authentication
- Tailwind CSS with NextUI components
- MobX state management integration

## Quick Start

```bash
# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development servers
pnpm dev
```

The Next.js app will be available at `http://localhost:3000`

## Deployment

### Next.js

Deploy to [Vercel](https://vercel.com/):

1. Import your repository
2. Set the root directory to `apps/nextjs`
3. Configure build settings:
   - **Install Command**: `pnpm install --filter @acme/nextjs...`
   - **Build Command**: `pnpm build --filter @acme/nextjs`
   - **Output Directory**: `.next`
4. Add environment variables (NEXTAUTH_SECRET, NEXTAUTH_URL, etc.)
5. Deploy!

### DappKit Package

The `@dappworks/kit` package can be published to npm:

```bash
cd packages/dappkit
pnpm build
npm publish
```
