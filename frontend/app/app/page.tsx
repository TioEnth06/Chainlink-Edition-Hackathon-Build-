"use client";

import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";

// Patent sains — each card is a patent (OpenSea-style) with image
const patents = [
  { href: "/app/marketplace", title: "Nano coating", sector: "Nanotech", initial: "Na", stat: "0.45", statLabel: "Floor", change: "0%", gradient: "from-cyan-600/40 to-cyan-900/60", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=400&fit=crop" },
  { href: "/app/marketplace", title: "Nano oxy", sector: "Nanotech", initial: "Na", stat: "0.32", statLabel: "Floor", change: "+5%", gradient: "from-violet-600/40 to-violet-900/60", image: "https://images.unsplash.com/photo-1603126857599-6bfe9c3d0c67?w=400&h=400&fit=crop" },
  { href: "/app/marketplace", title: "Biotech X", sector: "Biotech", initial: "Bi", stat: "1.20", statLabel: "Floor", change: "+12%", gradient: "from-emerald-600/40 to-emerald-900/60", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=400&fit=crop" },
  { href: "/app/marketplace", title: "Patent A", sector: "Pharma", initial: "PA", stat: "0.88", statLabel: "Floor", change: "—", gradient: "from-amber-600/40 to-amber-900/60", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop" },
  { href: "/app/marketplace", title: "Patent B", sector: "Cleantech", initial: "PB", stat: "0.56", statLabel: "Floor", change: "+8%", gradient: "from-rose-600/40 to-rose-900/60", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop" },
];

// Yield & APR - mock
const yieldStats = [
  { label: "Staking APY", value: "12.5%", sub: "General pool" },
  { label: "Lending APR", value: "8.2%", sub: "Avg. collateralized" },
  { label: "Funding success", value: "94%", sub: "Last 30 days" },
];

// News — Maple-style cards (number, title, description on hover, accent bars)
const newsItems = [
  { num: "01", title: "NanoFi partners with Chainlink", desc: "On-chain oracles for real-time valuation, automated liquidation, and verified collateral.", href: "#", barClass: "bg-cyan-500" },
  { num: "02", title: "IP-NFT standard on Solana", desc: "New IP-NFT standard is live on Solana devnet for tokenizing and trading patent assets.", href: "#", barClass: "bg-cyan-400" },
  { num: "03", title: "Vault and lending in beta", desc: "Patent vault and lending module now in beta. Register IP and access collateralized funding.", href: "#", barClass: "bg-zinc-600" },
  { num: "04", title: "Staking and marketplace", desc: "Earn yield from patent revenues and list or buy IP-NFTs on the NanoFi marketplace.", href: "#", barClass: "bg-violet-500" },
];

function TvlCard({ label, value, suffix, barWidths }: { label: string; value: string; suffix: string; barWidths: [string, string, string] }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-zinc-900/60 p-4 flex flex-col gap-2">
      <div className="absolute top-0 right-0 flex flex-col items-end">
        <div className="h-2 bg-cyan-500/80" style={{ width: barWidths[0] }} />
        <div className="h-2 bg-cyan-400/60" style={{ width: barWidths[1] }} />
        <div className="h-2 bg-cyan-400/40" style={{ width: barWidths[2] }} />
      </div>
      <h3 className="text-sm font-medium text-zinc-400">{label}</h3>
      <span className="font-display text-2xl font-semibold tracking-tight text-white">
        {value}
        <span className="ml-0.5 text-zinc-500">{suffix}</span>
      </span>
    </div>
  );
}

export default function AppDashboard() {
  const { connected } = useWallet();

  return (
    <div>
      <p className="section-label">Terminal</p>
      <h1 className="heading-display mt-3 text-display-md">Dashboard</h1>
      <p className="mt-4 max-w-xl text-zinc-400">
        One wallet, multiple roles: IP Owner, Investor, Lender, Staker, or Buyer.
      </p>

      {/* 1. TVL Showing — smaller card design with decorative bars */}
      <section className="mt-8">
        <h2 className="heading-2 text-white">TVL Overview</h2>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="w-full md:w-[55%]">
              <TvlCard label="Total Value Locked" value="$2.45" suffix="M" barWidths={["40%", "45%", "45%"]} />
            </div>
            <div className="w-full md:w-[45%]">
              <TvlCard label="Patents Tokenized" value="124" suffix="+" barWidths={["30%", "25%", "30%"]} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="w-full md:w-[60%]">
              <TvlCard label="Active Loans" value="48" suffix="+" barWidths={["45%", "50%", "30%"]} />
            </div>
            <div className="w-full md:w-[40%]">
              <TvlCard label="Avg. Funding Time" value="24" suffix=" hrs" barWidths={["40%", "35%", "30%"]} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Patent sains — one patent per card */}
      <section className="mt-10">
        <h2 className="heading-2 text-white">Patent sains</h2>
        <p className="mt-1 text-sm text-zinc-500">Scientific patents on NanoFi. View and trade IP-NFTs.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {patents.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/80 transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              {/* Patent image */}
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 font-display text-2xl font-bold text-white/80 drop-shadow-md">{card.initial}</span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-white group-hover:text-cyan-400/90 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">{card.sector}</p>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="text-sm text-zinc-500">
                    {card.statLabel}: <span className="font-medium text-white">{card.stat} SOL</span>
                  </span>
                  <span className={`text-xs font-medium ${card.change.startsWith("+") ? "text-emerald-400" : card.change === "—" ? "text-zinc-500" : "text-zinc-400"}`}>
                    {card.change}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Yield & APR overview */}
      <section className="mt-10">
        <h2 className="heading-2 text-white">Yield & APR overview</h2>
        <p className="mt-1 text-sm text-zinc-500">Current rates across lending and staking.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {yieldStats.map((item) => (
            <div key={item.label} className="card p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{item.label}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. News — Maple-style cards */}
      <section className="mt-10">
        <h2 className="heading-2 text-white">News</h2>
        <p className="mt-1 text-sm text-zinc-500">Updates and announcements.</p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newsItems.map((item) => (
            <a
              key={item.num}
              href={item.href}
              className="group relative flex h-[322px] flex-col gap-3 overflow-hidden rounded-xl bg-zinc-900/80 py-5 transition-all lg:h-[360px]"
            >
              <span className="px-5 font-display text-lg font-normal text-white/50">{item.num}</span>
              <div className="absolute left-0 w-full px-5 transition-all duration-300 top-20 flex flex-col gap-2 lg:top-[222px] group-hover:top-20">
                <h3 className="font-display text-xl font-normal text-white">{item.title}</h3>
                <p className="text-sm font-normal text-zinc-500 transition-all duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100">
                  {item.desc}
                </p>
              </div>
              <div className={`absolute left-0 w-full transition-all duration-300 bottom-[26px] h-[13px] opacity-10 group-hover:h-[360px] ${item.barClass}`} />
              <div className={`absolute bottom-[13px] left-0 h-[13px] w-full opacity-50 ${item.barClass}`} />
              <div className={`absolute bottom-0 left-0 h-[13px] w-full ${item.barClass}`} />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
