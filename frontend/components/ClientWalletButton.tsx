"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

/**
 * When connected: shows profile avatar (deterministic from address).
 * When disconnected: shows Connect button and opens wallet modal.
 */
export function ClientWalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible: setModalVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [menuOpen]);

  if (!mounted) {
    return (
      <div
        className="h-10 min-h-[44px] shrink-0 rounded-full bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-400 sm:h-9 sm:min-h-0 sm:px-5"
        aria-hidden
        style={{ minWidth: "44px" }}
      >
        Connect
      </div>
    );
  }

  if (!connected || !publicKey) {
    return (
      <button
        type="button"
        onClick={() => setModalVisible(true)}
        className="h-10 min-h-[44px] shrink-0 touch-manipulation rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-cyan-300 active:bg-cyan-500 sm:h-9 sm:min-h-0 sm:px-5"
        style={{ minWidth: "44px" }}
      >
        Connect
      </button>
    );
  }

  const base58 = publicKey.toBase58();
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/png?seed=${encodeURIComponent(base58)}&size=80`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(base58);
    setCopied(true);
    setTimeout(() => setCopied(false), 400);
    setMenuOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setMenuOpen(false);
  };

  const handleChangeWallet = () => {
    setModalVisible(true);
    setMenuOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800 ring-2 ring-transparent transition hover:border-cyan-500/50 hover:ring-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 active:border-cyan-500/70 sm:h-9 sm:w-9"
        style={{ minWidth: "44px", minHeight: "44px" }}
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        <img
          src={avatarUrl}
          alt="Profile"
          width={44}
          height={44}
          className="h-full w-full object-cover"
        />
      </button>

      {menuOpen && (
        <ul
          className="absolute right-0 top-full z-50 mt-2 min-w-[200px] max-w-[min(280px,calc(100vw-1rem))] rounded-xl border border-zinc-800 bg-zinc-900 py-1 shadow-xl"
          role="menu"
        >
          <li className="border-b border-zinc-800 px-4 py-2">
            <p className="truncate text-xs text-zinc-500" title={base58}>
              {base58.slice(0, 4)}...{base58.slice(-4)}
            </p>
          </li>
          <li role="menuitem">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full touch-manipulation px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white active:bg-zinc-800"
            >
              {copied ? "Copied!" : "Copy address"}
            </button>
          </li>
          <li role="menuitem">
            <button
              type="button"
              onClick={handleChangeWallet}
              className="w-full touch-manipulation px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white active:bg-zinc-800"
            >
              Change wallet
            </button>
          </li>
          <li role="menuitem">
            <button
              type="button"
              onClick={handleDisconnect}
              className="w-full touch-manipulation px-4 py-3 text-left text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 active:bg-zinc-800"
            >
              Disconnect
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
