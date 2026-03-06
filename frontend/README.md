# NanoFi Frontend

Next.js app: marketing site at `/` and dApp at `/app`.

## Setup

```bash
npm install
```

If install fails with ENOTEMPTY, remove `node_modules` and run `npm install` again.

## Security / npm audit

- **Run audit in this folder** (`frontend/`), not the repo root: `npm audit`
- **Root-level audit**: If you run `npm audit` from the repo root and see 6 vulnerabilities under `node_modules/npm/`, those are the npm CLI’s own dependencies, not the app. You can ignore them or run `npm audit fix` at root.
- **Frontend audit**: Many of the 30+ issues are transitive (e.g. `elliptic` via wallet adapters, `glob` via eslint-config-next). Safe fixes: `npm audit fix`. For a clean fix of ENOTEMPTY, remove `node_modules` and run `npm install` again; Next is pinned to a patched 14.x version.

## Run

```bash
npm run dev
```

Open the dev server URL shown in the terminal in your browser. Use **Enter App** to open the dApp; connect a Solana wallet (e.g. Phantom) on devnet.

## Build

```bash
npm run build
npm run start
```

Set `NEXT_PUBLIC_SOLANA_RPC` to your RPC URL (default: devnet).

## Deploy on Vercel

1. **Root Directory:** set to `frontend` (Project Settings → General).
2. **Output Directory:** leave **empty** (do not set to `public` — Next.js uses `.next`).
3. **Framework Preset:** Next.js.
4. Redeploy. The repo’s `frontend/vercel.json` only sets `"framework": "nextjs"` so the Next preset is used.
