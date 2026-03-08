# NanoFi
**Scientific IP Finance Protocol on Solana**  
Unlocking dormant patents into productive, on-chain financial assets.

## Overview

NanoFi is a decentralized finance protocol built on Solana that transforms patents and scientific intellectual property (IP) into programmable financial assets.

Most patents never reach commercialization due to:
- **Illiquidity**
- **Valuation uncertainty**
- **Lack of accessible funding**

NanoFi solves this by combining:
- On-chain IP registration
- Collateralized lending backed by patents
- Community-driven funding
- Staking-based ecosystem participation
- Commercialization marketplace

This hackathon version integrates Chainlink services to enable real-world data validation and automated financial logic.

## Problem

Over 75% of patents never get commercialized because:
- Banks cannot value IP properly
- Investors lack transparent risk metrics
- Funding is slow and opaque
- No programmable risk adjustment

**Intellectual Property is an illiquid asset.**  
NanoFi makes IP liquid.

## Solution

NanoFi introduces a modular IP finance stack:

| Module | Function |
|--------|----------|
| **Patent Vault** | Register and tokenize IP on-chain |
| **Funding** | Crowdfund innovation development |
| **Lending** | Borrow against patent collateral |
| **Staking** | Ecosystem participation & yield |
| **Marketplace** | Commercialized product exchange |

Chainlink integration enables:
- Real-time data feeds
- Automated liquidation
- Risk-adjusted collateral logic
- Off-chain verification triggers

## Architecture

**Blockchain Layer**
- Solana (high-speed, low-cost execution)

**Smart Contracts**
- PatentVault Program
- Lending Program
- Funding Pool Program
- Staking Program
- Marketplace Program

**Chainlink Integration**
- Price Feeds
- Automation
- Data Streams (optional)
- CCIP (future expansion)

## Chainlink Integration (Hackathon Core)

This submission integrates Chainlink to power:

1. **Real-Time Valuation Adjustment**  
   Patent-backed loans adjust collateral ratio based on:
   - Market index feeds
   - Risk variables
   - Token price feeds

2. **Automated Liquidation (Chainlink Automation)**  
   If:
   - LTV exceeds threshold
   - Risk factor spikes  
   Automation triggers smart contract state update.

3. **Off-Chain Data Verification (Optional Extension)**
   - Patent status validation
   - Commercial milestone confirmation

## Core Features

### 1. Patent Vault
Registers IP metadata on Solana:
- Patent ID
- Owner
- Jurisdiction
- Hash of legal documents
- Valuation reference

**Output:** NFT representing ownership + Vault contract for financial operations.

### 2. Funding Innovation
Crowdfunding mechanism:
- Public contributes capital
- Funds released in milestone stages
- On-chain transparency
- Chainlink verifies milestone triggers (optional extension).

### 3. Lending (Patent-Backed Loans)
**Borrowers:** Lock patent NFT as collateral → Receive capital in stable token.

**Smart logic:** LTV ratio, dynamic risk scoring, automated liquidation trigger.

### 4. Staking
Participants can:
- Stake tokens
- Earn ecosystem rewards
- Support commercialization pools  
Institutional staking pools supported.

### 5. Marketplace
Commercialized products:
- Sold on-chain
- Revenue tracked
- Automated distribution to: IP owner, Stakers, Funding contributors

## Why Solana?

- High throughput
- Low fees
- Fast settlement
- Suitable for real-world asset finance

## What Makes NanoFi Different?

- First scientific IP-native DeFi stack
- Patent as programmable collateral
- Community-funded commercialization
- Automated risk logic via Chainlink
- Full lifecycle: Registration → Funding → Lending → Marketization

## Hackathon Scope (What Is Live)

This hackathon version includes:
- Patent NFT minting
- Patent-backed lending
- Chainlink price feed integration
- Automated liquidation logic
- Basic staking pool
- Frontend dashboard

**Future features (mockups included):**
- AI Risk Engine
- Institutional Dashboard
- Cross-chain expansion

## Demo

**Live Demo:** [Insert URL]

**Demo Video:** [Insert 3–5 min walkthrough link]

## How It's Built

**Frontend:** React / Next.js, Solana Wallet Adapter, Anchor client

**Smart Contracts:** Solana Program Library (Rust, Anchor), Chainlink Solana (Data Feeds)

**Oracle:** Chainlink

## Environment and Run

### Environment variables (frontend)

Copy `frontend/.env.example` to `frontend/.env.local` and set:

- `NEXT_PUBLIC_SOLANA_RPC` – Solana RPC URL (default: `https://api.devnet.solana.com`)
- `NEXT_PUBLIC_LENDING_PROGRAM_ID` – Lending program ID (see `contracts/Anchor.toml` after build)
- `NEXT_PUBLIC_PATENT_VAULT_PROGRAM_ID` – Patent Vault program ID
- `NEXT_PUBLIC_CHAINLINK_FEED_SOL_USD` – Chainlink SOL/USD feed address for Devnet from [Chainlink Solana Feeds](https://docs.chain.link/data-feeds/price-feeds/addresses?network=solana)

### Build and deploy contracts (Solana Devnet)

From repo root:

```bash
cd contracts
anchor build
anchor deploy --provider.cluster devnet
```

Ensure the wallet in `Anchor.toml` (`[provider]`) has SOL on Devnet. After deploy, use the printed program IDs in `frontend/.env.local`.

### Run frontend

```bash
npm install
npm run dev
```

Open the dev server URL (e.g. http://localhost:3000). Use **Enter App** to open the dApp; connect a Solana wallet (e.g. Phantom) set to Devnet.

## Roadmap

- **Phase 1** – Hackathon MVP
- **Phase 2** – AI Risk Scoring Engine
- **Phase 3** – Institutional Credit Pools
- **Phase 4** – Cross-Chain Liquidity via CCIP
- **Phase 5** – Regulatory & Legal Structuring

## Team

- Founder – Product & Architecture
- Backend Developer
- Frontend Developer
- Security Engineer
- Designer

## Vision

NanoFi aims to become the financial infrastructure layer for scientific innovation.

Instead of patents sitting dormant, they become:
- Collateral
- Investable assets
- Yield-generating instruments
- Commercialized products

NanoFi transforms innovation into programmable finance.

## Repository Structure

```
contracts/
frontend/
mockups/
docs/
README.md
```

## Final Statement

NanoFi bridges science and decentralized finance.  
By combining Solana's speed with Chainlink's real-world connectivity, we create the first programmable IP finance protocol.

**Innovation deserves liquidity.**  
NanoFi delivers it.
