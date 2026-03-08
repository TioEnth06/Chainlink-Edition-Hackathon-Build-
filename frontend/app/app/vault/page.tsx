"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { getPatentVaultProgram, getPatentVaultProgramId, derivePatentVaultPda } from "@/lib/programs/patent-vault";

// Mock for patent owner dashboard
const dashboard = {
  totalPatents: 2,
  totalValuation: "125,000",
  status: "Active",
  capitalRaised: "45,000",
  outstandingLoan: "12,000",
};

const stages = ["R&D", "Prototype", "Market Ready"];

// User's patents (available) — for card grid like dashboard
const userPatentsMock = [
  { id: "1", title: "Nano coating", sector: "Nanotech", valuation: "$62,000", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=400&fit=crop", initial: "Na" },
  { id: "2", title: "Biotech X", sector: "Biotech", valuation: "$63,000", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=400&fit=crop", initial: "Bi" },
];

// All patents — for table (mock rows)
const allPatentsMock = [
  { id: "1", name: "Nano coating", sector: "Nanotech", valuation: "$62,000", status: "Active", profile: "Balanced" },
  { id: "2", name: "Nano oxy", sector: "Nanotech", valuation: "$48,000", status: "Active", profile: "Conservative" },
  { id: "3", name: "Biotech X", sector: "Biotech", valuation: "$125,000", status: "Active", profile: "Balanced" },
  { id: "4", name: "Patent A", sector: "Pharma", valuation: "$88,000", status: "Funding", profile: "Aggressive" },
  { id: "5", name: "Patent B", sector: "Cleantech", valuation: "$56,000", status: "Active", profile: "Balanced" },
];

export default function VaultPage() {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const [showForm, setShowForm] = useState(false);
  const [mintedPatent, setMintedPatent] = useState<{
    title: string;
    patentId: string;
    jurisdiction: string;
    stage: string;
    valuation: string;
    status: string;
  } | null>(null);
  const [selectedPatent, setSelectedPatent] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [patentId, setPatentId] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [filingDate, setFilingDate] = useState("");
  const [stage, setStage] = useState("R&D");
  const [valuation, setValuation] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [commercializationDesc, setCommercializationDesc] = useState("");
  const [patentFilter, setPatentFilter] = useState<"all" | "Nanotech" | "Biotech" | "Pharma" | "Cleantech">("all");
  const [patentSearch, setPatentSearch] = useState("");
  const [txPending, setTxPending] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const filteredPatents = allPatentsMock.filter((p) => {
    const matchFilter = patentFilter === "all" || p.sector === patentFilter;
    const matchSearch = !patentSearch.trim() || p.name.toLowerCase().includes(patentSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;
    setTxError(null);
    setTxPending(true);
    try {
      const program = getPatentVaultProgram(connection, { publicKey } as any);
      const mintKeypair = Keypair.generate();
      const programId = getPatentVaultProgramId();
      const [patentVaultPda] = derivePatentVaultPda(programId, publicKey, patentId.trim() || "default");
      const ownerTokenAccount = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        publicKey
      );
      const documentHash = new Uint8Array(32);
      if (ipfsHash.trim()) new TextEncoder().encode(ipfsHash).slice(0, 32).forEach((b, i) => (documentHash[i] = b));
      const valuationLamports = new BN(valuation.replace(/\D/g, "") || "0", 10);

      await program.methods
        .registerIp(
          patentId.trim() || "default",
          jurisdiction.trim() || "US",
          Array.from(documentHash),
          valuationLamports
        )
        .accounts({
          owner: publicKey,
          patentVault: patentVaultPda,
          mint: mintKeypair.publicKey,
          ownerTokenAccount,
          tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
        })
        .signers([mintKeypair])
        .rpc();

      setMintedPatent({
        title: title || "Patent",
        patentId: patentId || "—",
        jurisdiction,
        stage,
        valuation: valuation || "0",
        status: "Active",
      });
      setShowForm(false);
      setTitle("");
      setPatentId("");
      setJurisdiction("");
      setFilingDate("");
      setStage("R&D");
      setValuation("");
      setIpfsHash("");
      setCommercializationDesc("");
    } catch (err: any) {
      setTxError(err?.message ?? "Transaction failed");
    } finally {
      setTxPending(false);
    }
  };

  return (
    <div>
      <p className="section-label">Patent Vault</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-display text-display-md">IP Owner</h1>
        {connected && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn-primary shrink-0"
          >
            Register new patent
          </button>
        )}
      </div>
      <p className="mt-3 text-zinc-400">
        Register patents, view valuation, and unlock Funding, Lending, and Marketplace.
      </p>

      {txError && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {txError}
        </div>
      )}

      {!connected ? (
        <div className="card mt-10 p-8 text-center text-zinc-400">
          Connect your Solana wallet to access the Patent Vault.
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {/* A. Dashboard — compact stats cards */}
          <div className="flex flex-1 flex-row flex-wrap items-end justify-center gap-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
              <p className="text-sm font-normal leading-snug text-zinc-500">Total patents</p>
              <p className="mt-1 text-sm font-medium leading-tight text-white">{dashboard.totalPatents}</p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
              <p className="text-sm font-normal leading-snug text-zinc-500">Total valuation</p>
              <p className="mt-1 text-sm font-medium leading-tight text-white">${dashboard.totalValuation}</p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
              <p className="text-sm font-normal leading-snug text-zinc-500">Status</p>
              <p className="mt-1 text-sm font-medium leading-tight text-cyan-400">{dashboard.status}</p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
              <p className="text-sm font-normal leading-snug text-zinc-500">Capital raised</p>
              <p className="mt-1 text-sm font-medium leading-tight text-white">${dashboard.capitalRaised}</p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-5 py-4">
              <p className="text-sm font-normal leading-snug text-zinc-500">Outstanding loan</p>
              <p className="mt-1 text-sm font-medium leading-tight text-white">${dashboard.outstandingLoan}</p>
            </div>
          </div>

          {/* Patent available — cards like dashboard */}
          <section>
            <h2 className="heading-2 text-white">Patent available</h2>
            <p className="mt-1 text-sm text-zinc-500">Your tokenized patents. Click to view or take action.</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(mintedPatent ? [{ id: "minted", title: mintedPatent.title, sector: mintedPatent.stage, valuation: `$${mintedPatent.valuation}`, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop", initial: "IP" }, ...userPatentsMock] : userPatentsMock).map((card) => (
                <Link
                  key={card.id}
                  href="#"
                  className="group overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/80 transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
                    <Image src={card.image} alt={card.title} width={400} height={400} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 font-display text-2xl font-bold text-white/80 drop-shadow-md">{card.initial}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-white group-hover:text-cyan-400/90 transition-colors">{card.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{card.sector}</p>
                    <p className="mt-2 text-sm text-zinc-500">Valuation: <span className="font-medium text-white">{card.valuation}</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* All patents — filters + search + table */}
          <section>
            <h2 className="heading-2 text-white">All patents</h2>
            <p className="mt-1 text-sm text-zinc-500">Browse and filter all tokenized patents on the vault.</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
                {(["all", "Nanotech", "Biotech", "Pharma", "Cleantech"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setPatentFilter(f)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${patentFilter === f ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-500 hover:bg-white/5 hover:text-white"}`}
                  >
                    {f === "all" ? "All Patents" : f}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <input
                  type="search"
                  placeholder="Search patents..."
                  value={patentSearch}
                  onChange={(e) => setPatentSearch(e.target.value)}
                  className="input-base pl-10"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-900/50">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-700/80">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">Patent</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">Valuation</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">Sector</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">Profile</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-zinc-400" />
                  </tr>
                </thead>
                <tbody>
                  {filteredPatents.map((row) => (
                    <tr key={row.id} className="border-b border-zinc-800/80 transition hover:bg-zinc-800/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{row.name}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">{row.valuation}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${row.status === "Active" ? "text-cyan-400" : "text-amber-400"}`}>{row.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">{row.sector}</td>
                      <td className="px-4 py-3 text-sm text-zinc-500">{row.profile}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href="/app/funding" className="btn-secondary text-xs">Apply</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPatents.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-500">No patents match your filters.</p>
              )}
            </div>
          </section>

          {/* B. Form Register New Patent */}
          {showForm && (
            <div className="card p-8">
              <h2 className="heading-2">Register new patent</h2>
              <form onSubmit={handleRegister} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-400">Patent title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-base" placeholder="e.g. Solar cell composition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-400">Patent ID / Registration number</label>
                    <input type="text" value={patentId} onChange={(e) => setPatentId(e.target.value)} className="input-base" placeholder="e.g. US12345678" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-400">Jurisdiction</label>
                    <input type="text" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="input-base" placeholder="e.g. US, EP" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-400">Filing date</label>
                    <input type="date" value={filingDate} onChange={(e) => setFilingDate(e.target.value)} className="input-base" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">Current stage</label>
                  <select value={stage} onChange={(e) => setStage(e.target.value)} className="input-base">
                    {stages.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">Estimated valuation (USD)</label>
                  <input type="text" value={valuation} onChange={(e) => setValuation(e.target.value)} className="input-base" placeholder="e.g. 50000" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">Legal document (IPFS hash)</label>
                  <input type="text" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} className="input-base" placeholder="Qm..." />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">Commercialization description</label>
                  <textarea value={commercializationDesc} onChange={(e) => setCommercializationDesc(e.target.value)} className="input-base min-h-[100px]" placeholder="Brief description of use and market" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary" disabled={txPending}>
                    {txPending ? "Sending…" : "Mint patent NFT"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* C. Setelah mint: NFT card + detail */}
          {mintedPatent && (
            <div className="card border-cyan-500/30 p-8">
              <h2 className="heading-2">Minted patent</h2>
              <div className="mt-6 flex flex-wrap gap-8">
                <div className="min-w-[200px] rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-center">
                  <p className="text-xs text-zinc-500">NFT card</p>
                  <p className="mt-2 font-display font-semibold text-white">{mintedPatent.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{mintedPatent.patentId}</p>
                  <p className="mt-4 text-sm text-cyan-400">Eligible for: Funding · Lending · Marketplace</p>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-zinc-500">Valuation reference</p>
                      <p className="font-medium text-white">${mintedPatent.valuation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Risk score</p>
                      <p className="font-medium text-white">—</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Funding progress</p>
                      <div className="mt-1 h-2 w-full rounded-full bg-zinc-700"><div className="h-full w-0 rounded-full bg-cyan-500" /></div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Loan status</p>
                      <p className="font-medium text-white">None</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Revenue generated</p>
                      <p className="font-medium text-white">$0</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link href="/app/funding" className="btn-primary text-sm">Apply for funding</Link>
                    <Link href="/app/lending" className="btn-secondary text-sm">Request loan</Link>
                    <Link href="/app/marketplace" className="btn-secondary text-sm">List on marketplace</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
