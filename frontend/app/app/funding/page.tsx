"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const CATEGORIES = ["All", "Healthcare", "Industrial", "Energy", "Software"];

const OVERVIEW = {
  totalFunding: "$2.4M",
  onProgressCount: 12,
  successCount: 28,
  failedCount: 3,
};

const FUNDING_NEWS = [
  { num: "01", title: "Clean energy patent — Milestone 2 reached", desc: "Prototype delivery completed. Next: pilot deployment and performance report.", href: "#", barClass: "bg-cyan-500" },
  { num: "02", title: "Medical device IP — 80% funded", desc: "Funding round extended by 7 days. 42 backers, $64K raised of $80K goal.", href: "#", barClass: "bg-cyan-400" },
  { num: "03", title: "Industrial process — R&D phase update", desc: "Lab validation completed. Milestone 1 of 4 released to backers.", href: "#", barClass: "bg-zinc-600" },
  { num: "04", title: "Nano coating Co — Funding success", desc: "Campaign closed at 112% of goal. Distribution and next steps announced.", href: "#", barClass: "bg-emerald-500" },
];

const MOCK_PROPOSALS = [
  { id: "1", title: "Clean energy patent", goal: 50000, raised: 22500, backers: 12, daysLeft: 14, milestones: 3, category: "Energy", riskScore: "B", roi: "18%" },
  { id: "2", title: "Medical device IP", goal: 80000, raised: 42000, backers: 8, daysLeft: 21, milestones: 5, category: "Healthcare", riskScore: "B+", roi: "22%" },
  { id: "3", title: "Industrial process", goal: 30000, raised: 8000, backers: 3, daysLeft: 30, milestones: 4, category: "Industrial", riskScore: "A", roi: "15%" },
];

export default function FundingPage() {
  const { connected } = useWallet();
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  const selected = MOCK_PROPOSALS.find((p) => p.id === selectedId);
  const filtered = category === "All" ? MOCK_PROPOSALS : MOCK_PROPOSALS.filter((p) => p.category === category);

  return (
    <div>
      <p className="section-label">Funding</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-display text-display-md">Fund innovation</h1>
        {connected && (
          <button
            type="button"
            onClick={() => setShowCreateProposal(true)}
            className="btn-primary shrink-0"
          >
            Create funding proposal
          </button>
        )}
      </div>
      <p className="mt-3 text-zinc-400">
        As Patent Owner: create proposals. As Investor: explore and contribute.
      </p>

      {!connected ? (
        <div className="card mt-10 p-8 text-center text-zinc-400">
          Connect your Solana wallet to use Funding.
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <>
            {/* Overview */}
            <section>
              <h2 className="heading-2 text-white">Overview</h2>
              <p className="mt-1 text-sm text-zinc-500">Total funding volume and campaign outcomes.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">Total funding</p>
                  <p className="mt-1 text-lg font-semibold leading-tight text-white">{OVERVIEW.totalFunding}</p>
                </div>
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">On progress funding</p>
                  <p className="mt-1 text-lg font-semibold leading-tight text-cyan-400">{OVERVIEW.onProgressCount} patent/company</p>
                </div>
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">Success funding</p>
                  <p className="mt-1 text-lg font-semibold leading-tight text-emerald-400">{OVERVIEW.successCount} patent/company</p>
                </div>
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">Failed funding</p>
                  <p className="mt-1 text-lg font-semibold leading-tight text-zinc-400">{OVERVIEW.failedCount} patent/company</p>
                </div>
              </div>
            </section>

            {/* My funding dashboard — vault-style compact stat cards */}
            <section>
              <h2 className="heading-2 text-white">My funding dashboard</h2>
              <div className="mt-6 flex flex-1 flex-row flex-wrap items-end justify-center gap-4">
                <div className="min-w-[140px] rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">Progress</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-zinc-700">
                    <div className="h-full w-[45%] rounded-full bg-cyan-500" />
                  </div>
                  <p className="mt-1 text-sm font-medium leading-tight text-white">45% funded</p>
                </div>
                <div className="min-w-[140px] rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">Amount raised</p>
                  <p className="mt-1 text-sm font-medium leading-tight text-white">$22,500</p>
                </div>
                <div className="min-w-[140px] rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">Remaining days</p>
                  <p className="mt-1 text-sm font-medium leading-tight text-white">14</p>
                </div>
                <div className="min-w-[140px] rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">Backers</p>
                  <p className="mt-1 text-sm font-medium leading-tight text-white">12</p>
                </div>
                <div className="min-w-[180px] rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
                  <p className="text-sm font-normal leading-snug text-zinc-500">Milestone status</p>
                  <p className="mt-1 text-sm font-medium leading-tight text-white">1 of 3 · Next: Prototype delivery</p>
                </div>
              </div>
            </section>

            {showCreateProposal && (
              <div className="card p-8">
                <h2 className="heading-2">Create funding proposal</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Target raise (USD)</label>
                    <input type="text" className="input-base" placeholder="50000" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Minimum contribution</label>
                    <input type="text" className="input-base" placeholder="100" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Timeline (days)</label>
                    <input type="text" className="input-base" placeholder="90" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Revenue share %</label>
                    <input type="text" className="input-base" placeholder="20" />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="mb-1.5 block text-sm text-zinc-400">Milestone structure</label>
                  <textarea className="input-base min-h-[80px]" placeholder="e.g. Milestone 1: R&D completion, 30%" />
                </div>
                <div className="mt-5">
                  <label className="mb-1.5 block text-sm text-zinc-400">Use of funds</label>
                  <textarea className="input-base min-h-[80px]" placeholder="Description" />
                </div>
                <div className="mt-6 flex gap-3">
                  <button type="button" className="btn-primary">Submit proposal</button>
                  <button type="button" onClick={() => setShowCreateProposal(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-zinc-500">Category</p>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === c ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:bg-white/5"}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((p) => (
                <div key={p.id} className="card card-hover p-6">
                  <div className="flex justify-between">
                    <span className="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300">{p.category}</span>
                    <span className="text-xs text-zinc-500">Risk {p.riskScore} · ROI {p.roi}</span>
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-white">{p.title}</h3>
                  <div className="mt-4 h-2 w-full rounded-full bg-zinc-700">
                    <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(p.raised / p.goal) * 100}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">
                    {p.raised.toLocaleString()} / {p.goal.toLocaleString()} · {p.backers} backers · {p.daysLeft}d left
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={() => setSelectedId(p.id)} className="btn-primary text-sm">Contribute</button>
                    <button type="button" className="btn-secondary text-sm">View details</button>
                  </div>
                </div>
              ))}
            </div>

            {selected && (
              <div className="card p-8">
                <h2 className="heading-2">Patent detail · {selected.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Overview, financial projection, capital requirement, milestone structure, revenue model.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSelectedId(null);
                    setContributeAmount("");
                  }}
                  className="mt-6 flex gap-3"
                >
                  <input
                    type="text"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    className="input-base flex-1"
                    placeholder="Contribution amount"
                  />
                  <button type="submit" className="btn-primary">Contribute</button>
                </form>
                <div className="mt-4 flex gap-4 text-sm">
                  <button type="button" className="text-cyan-400 hover:underline">View whitepaper</button>
                  <button type="button" className="text-cyan-400 hover:underline">View risk assessment</button>
                </div>
              </div>
            )}

            {/* News — progress updates from funded projects (dashboard-style cards) */}
            <section className="mt-10">
              <h2 className="heading-2 text-white">News</h2>
              <p className="mt-1 text-sm text-zinc-500">Progress updates from projects and patents in funding.</p>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {FUNDING_NEWS.map((item) => (
                  <a
                    key={item.num}
                    href={item.href}
                    className="group relative flex h-[322px] flex-col gap-3 overflow-hidden rounded-xl bg-zinc-900/80 py-5 transition-all lg:h-[360px]"
                  >
                    <span className="px-5 font-display text-lg font-normal text-white/50">{item.num}</span>
                    <div className="absolute left-0 top-20 flex w-full flex-col gap-2 px-5 transition-all duration-300 lg:top-[222px] group-hover:top-20">
                      <h3 className="font-display text-xl font-normal text-white">{item.title}</h3>
                      <p className="text-sm font-normal text-zinc-500 opacity-100 transition-all duration-300 lg:opacity-0 group-hover:opacity-100">{item.desc}</p>
                    </div>
                    <div className={`absolute bottom-[26px] left-0 h-[13px] w-full opacity-10 transition-all duration-300 group-hover:h-[360px] ${item.barClass}`} />
                    <div className={`absolute bottom-[13px] left-0 h-[13px] w-full opacity-50 ${item.barClass}`} />
                    <div className={`absolute bottom-0 left-0 h-[13px] w-full ${item.barClass}`} />
                  </a>
                ))}
              </div>
            </section>
          </>
        </div>
      )}
    </div>
  );
}
