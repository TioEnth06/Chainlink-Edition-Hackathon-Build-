"use client";

import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import BN from "bn.js";
import {
  getLendingProgram,
  getLendingProgramId,
  derivePoolPda,
  derivePositionPda,
} from "@/lib/programs/lending";

const DURATIONS = ["30 days", "90 days", "180 days"];

export default function LendingPage() {
  const { connection } = useConnection();
  const { connected, publicKey: walletPublicKey } = useWallet();
  const [view, setView] = useState<"borrower" | "lender">("borrower");
  const [requestAmount, setRequestAmount] = useState("");
  const [duration, setDuration] = useState("90 days");
  const [acceptLiquidation, setAcceptLiquidation] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  // Deposit form
  const [patentVaultPubkey, setPatentVaultPubkey] = useState("");
  const [collateralValuation, setCollateralValuation] = useState("");

  // On-chain state
  const [poolAccount, setPoolAccount] = useState<{
    liquidationLtvBps: number;
    stableMint: PublicKey;
  } | null>(null);
  const [positionAccount, setPositionAccount] = useState<{
    collateralValuationLamports: BN;
    debtLamports: BN;
    liquidatable: boolean;
  } | null>(null);

  const programId = getLendingProgramId();
  const [poolPda] = derivePoolPda(programId);
  const positionPda = walletPublicKey
    ? derivePositionPda(programId, walletPublicKey)[0]
    : null;

  const fetchOnChainState = useCallback(async () => {
    if (!connected || !walletPublicKey) return;
    const program = getLendingProgram(connection, { publicKey: walletPublicKey } as any);
    try {
      const pool = await program.account.lendingPool.fetch(poolPda).catch(() => null);
      if (pool) setPoolAccount({
        liquidationLtvBps: Number((pool as any).liquidationLtvBps),
        stableMint: (pool as any).stableMint as PublicKey,
      });
      const position = await program.account.loanPosition.fetch(positionPda!).catch(() => null);
      if (position) setPositionAccount({
        collateralValuationLamports: (position as any).collateralValuationLamports as BN,
        debtLamports: (position as any).debtLamports as BN,
        liquidatable: (position as any).liquidatable as boolean,
      });
    } catch {
      setPoolAccount(null);
      setPositionAccount(null);
    }
  }, [connection, connected, walletPublicKey, poolPda, positionPda]);

  useEffect(() => {
    fetchOnChainState();
  }, [fetchOnChainState]);

  const handleDepositCollateral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletPublicKey || !patentVaultPubkey.trim() || !collateralValuation.trim()) return;
    setTxError(null);
    setTxPending(true);
    try {
      const program = getLendingProgram(connection, { publicKey: walletPublicKey } as any);
      const patentVault = new PublicKey(patentVaultPubkey.trim());
      const lamports = new BN(collateralValuation.replace(/\D/g, "") || "0");
      await program.methods
        .depositCollateral(patentVault, lamports)
        .accounts({
          borrower: walletPublicKey,
          pool: poolPda,
          position: positionPda!,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      await fetchOnChainState();
      setPatentVaultPubkey("");
      setCollateralValuation("");
    } catch (err: any) {
      setTxError(err?.message ?? "Transaction failed");
    } finally {
      setTxPending(false);
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletPublicKey || !requestAmount || !poolAccount) return;
    setTxError(null);
    setTxPending(true);
    try {
      const program = getLendingProgram(connection, { publicKey: walletPublicKey } as any);
      const poolStableTreasury = getAssociatedTokenAddressSync(
        poolAccount.stableMint,
        poolPda,
        true
      );
      const borrowerStableAta = getAssociatedTokenAddressSync(
        poolAccount.stableMint,
        walletPublicKey
      );
      const amount = new BN(requestAmount.replace(/\D/g, "") || "0");
      await program.methods
        .borrow(amount)
        .accounts({
          borrower: walletPublicKey,
          pool: poolPda,
          position: positionPda!,
          poolStableTreasury,
          borrowerStableAta,
          tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        })
        .rpc();
      await fetchOnChainState();
      setRequestAmount("");
    } catch (err: any) {
      setTxError(err?.message ?? "Transaction failed");
    } finally {
      setTxPending(false);
    }
  };

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletPublicKey || !requestAmount || !poolAccount) return;
    setTxError(null);
    setTxPending(true);
    try {
      const program = getLendingProgram(connection, { publicKey: walletPublicKey } as any);
      const poolStableTreasury = getAssociatedTokenAddressSync(
        poolAccount.stableMint,
        poolPda,
        true
      );
      const borrowerStableAta = getAssociatedTokenAddressSync(
        poolAccount.stableMint,
        walletPublicKey
      );
      const amount = new BN(requestAmount.replace(/\D/g, "") || "0");
      await program.methods
        .repay(amount)
        .accounts({
          borrower: walletPublicKey,
          pool: poolPda,
          position: positionPda!,
          poolStableTreasury,
          borrowerStableAta,
          tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        })
        .rpc();
      await fetchOnChainState();
      setRequestAmount("");
    } catch (err: any) {
      setTxError(err?.message ?? "Transaction failed");
    } finally {
      setTxPending(false);
    }
  };

  const handleUpdateFromFeed = async () => {
    const feedAddress = process.env.NEXT_PUBLIC_CHAINLINK_FEED_SOL_USD;
    if (!walletPublicKey || !feedAddress?.trim() || !positionPda) {
      setTxError("Set NEXT_PUBLIC_CHAINLINK_FEED_SOL_USD in .env and connect wallet.");
      return;
    }
    setTxError(null);
    setTxPending(true);
    try {
      const program = getLendingProgram(connection, { publicKey: walletPublicKey } as any);
      await program.methods
        .updateCollateralFromFeed()
        .accounts({
          chainlinkFeed: new PublicKey(feedAddress.trim()),
          position: positionPda,
        })
        .rpc();
      await fetchOnChainState();
    } catch (err: any) {
      setTxError(err?.message ?? "Transaction failed");
    } finally {
      setTxPending(false);
    }
  };

  const hasPosition = positionAccount != null;
  const debtLamports = positionAccount?.debtLamports?.toNumber() ?? 0;
  const collateralLamports = positionAccount?.collateralValuationLamports?.toNumber() ?? 0;
  const liquidationBps = poolAccount?.liquidationLtvBps ?? 8000;

  return (
    <div>
      <p className="section-label">Lending</p>
      <h1 className="heading-display mt-2 text-display-md">Borrow or provide liquidity</h1>
      <p className="mt-3 text-zinc-400">
        As Borrower: request loans against patent collateral. As Lender: deposit into pools and earn yield.
      </p>

      {txError && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {txError}
        </div>
      )}

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
                <h2 className="heading-2">Deposit collateral</h2>
                <form onSubmit={handleDepositCollateral} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Patent Vault (Pubkey)</label>
                    <input
                      type="text"
                      value={patentVaultPubkey}
                      onChange={(e) => setPatentVaultPubkey(e.target.value)}
                      className="input-base"
                      placeholder="e.g. Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Collateral valuation (lamports)</label>
                    <input
                      type="text"
                      value={collateralValuation}
                      onChange={(e) => setCollateralValuation(e.target.value)}
                      className="input-base"
                      placeholder="e.g. 50000000"
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={txPending}>
                    {txPending ? "Sending…" : "Deposit collateral"}
                  </button>
                </form>
              </div>

              <div className="card p-8">
                <h2 className="heading-2">Loan request</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-zinc-500">Patent valuation (on-chain)</p>
                    <p className="mt-1 font-semibold text-white">
                      {collateralLamports > 0 ? `${(collateralLamports / 1e9).toFixed(2)} SOL` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Max borrow (75% LTV)</p>
                    <p className="mt-1 font-semibold text-white">
                      {collateralLamports > 0 ? `${Math.floor((collateralLamports * 0.75) / 1e9)} lamports` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Current debt</p>
                    <p className="mt-1 font-semibold text-white">{debtLamports > 0 ? `${debtLamports}` : "0"} lamports</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Liquidation LTV</p>
                    <p className="mt-1 font-semibold text-cyan-400">{liquidationBps / 100}%</p>
                  </div>
                </div>
                <form onSubmit={handleBorrow} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm text-zinc-400">Borrow amount (lamports)</label>
                    <input
                      type="text"
                      value={requestAmount}
                      onChange={(e) => setRequestAmount(e.target.value)}
                      className="input-base"
                      placeholder="e.g. 10000000"
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={acceptLiquidation}
                      onChange={(e) => setAcceptLiquidation(e.target.checked)}
                      className="rounded border-zinc-600 bg-zinc-800"
                    />
                    <span className="text-sm text-zinc-400">I accept auto-liquidation when LTV exceeds threshold</span>
                  </label>
                  <button type="submit" className="btn-primary" disabled={txPending || !poolAccount}>
                    {txPending ? "Sending…" : "Request loan"}
                  </button>
                </form>
              </div>

              {hasPosition && (
                <div className="card p-8">
                  <h2 className="heading-2">Loan dashboard</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <p className="text-xs text-zinc-500">Collateral value</p>
                      <p className="mt-1 text-xl font-semibold text-white">{collateralLamports} lamports</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Outstanding debt</p>
                      <p className="mt-1 text-xl font-semibold text-white">{debtLamports} lamports</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Liquidation threshold</p>
                      <p className="mt-1 text-xl font-semibold text-cyan-400">{liquidationBps / 100}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Liquidatable</p>
                      <p className="mt-1 text-xl font-semibold text-white">{positionAccount?.liquidatable ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <form onSubmit={handleRepay} className="flex gap-2">
                      <input
                        type="text"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        className="input-base w-32"
                        placeholder="Amount"
                      />
                      <button type="submit" className="btn-primary" disabled={txPending || !poolAccount}>
                        {txPending ? "…" : "Repay"}
                      </button>
                    </form>
                    <button
                      type="button"
                      onClick={handleUpdateFromFeed}
                      className="btn-secondary"
                      disabled={txPending}
                    >
                      Update from Chainlink feed
                    </button>
                  </div>
                </div>
              )}

              {!poolAccount && (
                <p className="text-sm text-zinc-500">Pool not initialized on-chain. Initialize pool first to borrow.</p>
              )}
            </>
          )}

          {view === "lender" && (
            <div className="card p-8">
              <h2 className="heading-2">Lending pool overview</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Pool PDA: {poolPda.toBase58()}. Deposit liquidity and pool stats require pool initialization and treasury setup.
              </p>
              <div className="mt-6 flex gap-3">
                <button type="button" className="btn-secondary" onClick={fetchOnChainState}>
                  Refresh state
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
