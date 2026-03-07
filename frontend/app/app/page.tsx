"use client";

import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";

const patents = [
  { href: "/app/marketplace", title: "Nano coating", sector: "Nanotech", initial: "Na", stat: "0.45", statLabel: "Floor", change: "0%", image: "/images/dashboard-sphere.png" },
  { href: "/app/marketplace", title: "Nano oxy", sector: "Nanotech", initial: "Na", stat: "0.32", statLabel: "Floor", change: "+5%", image: "/images/dashboard-splash1.png" },
  { href: "/app/marketplace", title: "Biotech X", sector: "Biotech", initial: "Bi", stat: "1.20", statLabel: "Floor", change: "+12%", image: "/images/dashboard-splash2.png" },
  { href: "/app/marketplace", title: "Patent A", sector: "Pharma", initial: "PA", stat: "0.88", statLabel: "Floor", change: "—", image: "/images/dashboard-microscope.png" },
  { href: "/app/marketplace", title: "Patent B", sector: "Cleantech", initial: "PB", stat: "0.56", statLabel: "Floor", change: "+8%", image: "/images/dashboard-spark.png" },
];

const yieldStats = [
  { label: "Staking APY", value: "12.5%", sub: "General pool" },
  { label: "Lending APR", value: "8.2%", sub: "Avg. collateralized" },
  { label: "Funding success", value: "94%", sub: "Last 30 days" },
];

const newsItems = [
  { num: "01", title: "NanoFi partners with Chainlink", desc: "On-chain oracles for real-time valuation, automated liquidation, and verified collateral.", href: "#", barClass: "bg-cyan-500", image: "/images/news-circuit.png" },
  { num: "02", title: "IP-NFT standard on Solana", desc: "New IP-NFT standard is live on Solana devnet for tokenizing and trading patent assets.", href: "#", barClass: "bg-cyan-400", image: "/images/news-watch.png" },
  { num: "03", title: "Vault and lending in beta", desc: "Patent vault and lending module now in beta. Register IP and access collateralized funding.", href: "#", barClass: "bg-zinc-600", image: "/images/news-vault.png" },
  { num: "04", title: "Staking and marketplace", desc: "Earn yield from patent revenues and list or buy IP-NFTs on the NanoFi marketplace.", href: "#", barClass: "bg-violet-500", image: "/images/news-totem.png" },
];

type TvlCardProps = {
  label: string;
  value: string;
  suffix: string;
  barWidths: [string, string, string];
};

function TvlCard({ label, value, suffix, barWidths }: TvlCardProps) {
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-lg bg-zinc-900/60 p-4">
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
  useWallet();

  return (
    <div>
      <p className="section-label">Terminal</p>
      <h1 className="heading-display mt-3 text-display-md">Dashboard</h1>
      <p className="mt-4 max-w-xl text-zinc-400">
        One wallet, multiple roles: IP Owner, Investor, Lender, Staker, or Buyer.
      </p>

      <section className="mt-8">
        <h2 className="heading-2 text-white">TVL Overview</h2>
        <div className="mt-4 flex w-full flex-col gap-3">
          <div className="flex w-full flex-col gap-3 md:flex-row">
            <div className="w-full md:w-[55%]">
              <TvlCard label="Total Value Locked" value="$2.45" suffix="M" barWidths={["40%", "45%", "45%"]} />
            </div>
            <div className="w-full md:w-[45%]">
              <TvlCard label="Patents Tokenized" value="124" suffix="+" barWidths={["30%", "25%", "30%"]} />
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 md:flex-row">
            <div className="w-full md:w-[60%]">
              <TvlCard label="Active Loans" value="48" suffix="+" barWidths={["45%", "50%", "30%"]} />
            </div>
            <div className="w-full md:w-[40%]">
              <TvlCard label="Avg. Funding Time" value="24" suffix=" hrs" barWidths={["40%", "35%", "30%"]} />
            </div>
          </div>
        </div>
      </section>

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
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
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
                  <span
                    className={
                      card.change.startsWith("+")
                        ? "text-xs font-medium text-emerald-400"
                        : card.change === "—"
                          ? "text-xs font-medium text-zinc-500"
                          : "text-xs font-medium text-zinc-400"
                    }
                  >
                    {card.change}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
              <div className="absolute inset-0">
                <Image src={item.image} alt="" fill className="object-cover opacity-60 transition-opacity group-hover:opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-zinc-900/40" aria-hidden />
              </div>
              <span className="relative z-10 px-5 font-display text-lg font-normal text-white/50">{item.num}</span>
              <div className="absolute left-0 top-20 z-10 flex w-full flex-col gap-2 px-5 transition-all duration-300 group-hover:top-20 lg:top-[222px]">
                <h3 className="font-display text-xl font-normal text-white">{item.title}</h3>
                <p className="text-sm font-normal text-zinc-500 transition-all duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100">
                  {item.desc}
                </p>
              </div>
              <div className={`absolute bottom-[26px] left-0 z-10 h-[13px] w-full opacity-10 transition-all duration-300 group-hover:h-[360px] ${item.barClass}`} aria-hidden />
              <div className={`absolute bottom-[13px] left-0 z-10 h-[13px] w-full opacity-50 ${item.barClass}`} aria-hidden />
              <div className={`absolute bottom-0 left-0 z-10 h-[13px] w-full ${item.barClass}`} aria-hidden />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
