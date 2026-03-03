"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const POOLS = [
  { id: "general", name: "General ecosystem pool", apy: "12%", risk: "Medium", yield: "Stable", patents: "All" },
  { id: "healthcare", name: "Healthcare sector pool", apy: "15%", risk: "Medium-High", yield: "Higher", patents: "Healthcare" },
  { id: "institutional", name: "Institutional pool", apy: "8%", risk: "Low", yield: "Conservative", patents: "Verified only" },
];

export default function StakingPage() {
  const { connected } = useWallet();
  const [stakeAmount, setStakeAmount] = useState("");
  const [staked, setStaked] = useState(1250);
  const [rewards, setRewards] = useState(45);
  const [lockDuration, setLockDuration] = useState("90 days");
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(stakeAmount) || 0;
    setStaked((s) => s + amt);
    setStakeAmount("");
    setSelectedPool(null);
  };

  return (
    <div>
      <p className="section-label">Staking</p>
      <h1 className="heading-display mt-2 text-display-md">Stake & earn</h1>
      <p className="mt-3 text-zinc-400">
        Stake tokens, earn APY, and support commercialization pools. Choose by risk and sector.
      </p>

      {!connected ? (
        <div className="card mt-10 p-8 text-center text-zinc-400">
          Connect your Solana wallet to stake.
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <div className="card p-8">
            <h2 className="heading-2">Stake dashboard</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-zinc-500">Total staked</p>
                <p className="mt-1 text-2xl font-semibold text-white">{staked.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">APY</p>
                <p className="mt-1 text-2xl font-semibold text-cyan-400">12%</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Rewards earned</p>
                <p className="mt-1 text-2xl font-semibold text-white">{rewards}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Lock duration</p>
                <p className="mt-1 text-2xl font-semibold text-white">{lockDuration}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn-primary">Stake</button>
              <button type="button" className="btn-secondary">Unstake</button>
              <button type="button" className="btn-secondary">Claim rewards</button>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="heading-2">Pool selection</h2>
            <p className="mt-1 text-sm text-zinc-500">Choose by risk profile, historical yield, and supported patent types.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {POOLS.map((pool) => (
                <div
                  key={pool.id}
                  className={`card-hover card cursor-pointer p-6 ${selectedPool === pool.id ? "border-cyan-500/50" : ""}`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <h3 className="font-display font-semibold text-white">{pool.name}</h3>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="text-zinc-500">APY:</span> <span className="text-cyan-400">{pool.apy}</span></p>
                    <p><span className="text-zinc-500">Risk:</span> <span className="text-white">{pool.risk}</span></p>
                    <p><span className="text-zinc-500">Yield:</span> <span className="text-white">{pool.yield}</span></p>
                    <p><span className="text-zinc-500">Patents:</span> <span className="text-white">{pool.patents}</span></p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedPool(pool.id); }}
                    className="btn-primary mt-4 w-full text-sm"
                  >
                    Select pool
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedPool && (
            <div className="card p-8">
              <h2 className="heading-2">Stake in pool</h2>
              <form onSubmit={handleStake} className="mt-6 flex gap-3">
                <input
                  type="text"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="input-base flex-1"
                  placeholder="Amount to stake"
                />
                <select value={lockDuration} onChange={(e) => setLockDuration(e.target.value)} className="input-base w-40">
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="180 days">180 days</option>
                </select>
                <button type="submit" className="btn-primary shrink-0">Stake</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
