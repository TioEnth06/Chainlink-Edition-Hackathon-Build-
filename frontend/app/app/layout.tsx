"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletProvider } from "@/components/WalletProvider";
import { ClientWalletButton } from "@/components/ClientWalletButton";

const navLinks = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/vault", label: "Vault" },
  { href: "/app/lending", label: "Lending" },
  { href: "/app/staking", label: "Staking" },
  { href: "/app/funding", label: "Funding" },
  { href: "/app/marketplace", label: "Marketplace" },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <WalletProvider>
      <div className="relative min-h-screen">
        {/* Background — cosmic/scientific design */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/app-bg.png)" }}
          aria-hidden
        />
        <div className="fixed inset-0 bg-[#0a0a0b]/50 backdrop-blur-[1px]" aria-hidden />
        <div className="relative z-10 min-h-screen">
          <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0b]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
              {/* Left: logo + Terminal — fixed width, no shrink */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Link
                  href="/"
                  className="font-display text-base font-semibold text-white transition hover:text-cyan-400 sm:text-lg"
                >
                  NanoFi
                </Link>
                <span className="hidden text-zinc-500 sm:inline">|</span>
                <Link href="/app" className="hidden text-sm text-zinc-400 hover:text-white sm:inline">
                  Terminal
                </Link>
              </div>
              {/* Center: nav links — scroll on small screens, centered on large */}
              <div className="flex min-w-0 flex-1 justify-center overflow-x-auto">
                <div className="flex items-center gap-0.5 py-1 md:gap-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={
                          isActive
                            ? "shrink-0 rounded-lg bg-white/10 px-2.5 py-2 text-sm font-medium text-white transition touch-manipulation sm:px-3.5"
                            : "shrink-0 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-400 transition touch-manipulation hover:bg-white/5 hover:text-white sm:px-3.5"
                        }
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
              {/* Right: wallet button — fixed position, no shrink */}
              <div className="flex shrink-0 items-center justify-end">
                <ClientWalletButton />
              </div>
            </div>
          </nav>
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
        </div>
      </div>
    </WalletProvider>
  );
}
