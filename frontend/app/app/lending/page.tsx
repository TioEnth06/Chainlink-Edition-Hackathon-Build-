"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const DURATIONS = ["30 days", "90 days", "180 days"];

export default function LendingPage() {
  const { connected } = useWallet();
  const [view, setView] = useState<"borrower" | "lender">("borrower");
  const [requestAmount, setRequestAmount] = useState("");
  const [duration, setDuration] = useState("90 days");
  const [acceptLiquidation, setAcceptLiquidation] = useState(false);
  const [hasLoan, setHasLoan] = useState(false);

  // Mock borrower dashboard
  const loan = {
    outstanding: 12000,
    interestAccrued: 120,
    liquidationThreshold: "80%",
    riskLevel: "Medium",
    timeRemaining: "45 days",
  };

  // Mock pool
  const pool = {
    totalLiquidity: "450,000",
    activeLoans: 12,
    avgApy: "8.5%",
    defaultRate: "0.2%",
    riskRating: "A",
  };

  const handleRequestLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestAmount && acceptLiquidation) setHasLoan(true);
  };

  return (
    <div>
      <p className="section-label">Lending</p>
      <h1 className="heading-display mt-2 text-display-md">Borrow or provide liquidity</h1>
      <p className="mt-3 text-zinc-400">
        As Borrower: request loans against patent collateral. As Lender: deposit into pools and earn yield.
      </p>

      {!connected ? (
        <div className="card mt-10 p-8 text-center text-zinc-400">
          Connect your Solana wallet to use Lending.
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("borrower")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === "borrower" ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:bg-white/5"}`}
            >
              Borrower
            </button>
            <button
              type="button"
              onClick={() => setView("lender")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === "lender" ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:bg-white/5"}`}
            >
              Lender
            </button>
          </div>

          {view === "borrower" && (
            <>
              <div className="card p-8">
                <h2 className="heading-2">Loan request</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-zinc-500">Patent valuation</p>
                    <p className="mt-1 font-semibold text-white">$50,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Max borrow amount</p>
                    <p className="mt-1 font-semibold text-white">$37,500</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Current LTV</p>
                    <p className="mt-1 font-semibold text-white">0%</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Suggested rate</p>
                    <p className="mt-1 font-semibold text-white">8% APY</p>
                  </div>
                </div>
                <form onSubmit={handleRequestLoan} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Requested amount</label>
                    <input
                      type="text"
                      value={requestAmount}
                      onChange={(e) => setRequestAmount(e.target.value)}
                      className="input-base"
                      placeholder="e.g. 10000"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Duration</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input-base">
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={acceptLiquidation}
                      onChange={(e) => setAcceptLiquidation(e.target.checked)}
                      className="rounded border-zinc-600 bg-zinc-800"
                    />
                    <span className="text-sm text-zinc-400">I accept auto-liquidation conditions when LTV exceeds threshold</span>
                  </label>
                  <button type="submit" className="btn-primary">Request loan</button>
                </form>
              </div>

              {hasLoan && (
                <div className="card p-8">
                  <h2 className="heading-2">Loan dashboard</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <p className="text-xs text-zinc-500">Outstanding loan</p>
                      <p className="mt-1 text-xl font-semibold text-white">${loan.outstanding.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Interest accrued</p>
                      <p className="mt-1 text-xl font-semibold text-white">${loan.interestAccrued}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Liquidation threshold</p>
                      <p className="mt-1 text-xl font-semibold text-cyan-400">{loan.liquidationThreshold}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Risk level</p>
                      <p className="mt-1 text-xl font-semibold text-white">{loan.riskLevel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Time remaining</p>
                      <p className="mt-1 text-xl font-semibold text-white">{loan.timeRemaining}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" className="btn-primary">Repay</button>
                    <button type="button" className="btn-secondary">Add collateral</button>
                    <button type="button" className="btn-secondary">Extend loan</button>
                  </div>
                </div>
              )}
            </>
          )}

          {view === "lender" && (
            <div className="card p-8">
              <h2 className="heading-2">Lending pool overview</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <p className="text-xs text-zinc-500">Total liquidity</p>
                  <p className="mt-1 text-xl font-semibold text-white">${pool.totalLiquidity}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Active loans</p>
                  <p className="mt-1 text-xl font-semibold text-white">{pool.activeLoans}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Average APY</p>
                  <p className="mt-1 text-xl font-semibold text-cyan-400">{pool.avgApy}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Default rate</p>
                  <p className="mt-1 text-xl font-semibold text-white">{pool.defaultRate}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Risk rating</p>
                  <p className="mt-1 text-xl font-semibold text-white">{pool.riskRating}</p>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" className="btn-primary">Deposit liquidity</button>
                <button type="button" className="btn-secondary">Withdraw liquidity</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
