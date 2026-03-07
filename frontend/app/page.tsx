import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0b]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight text-white">
            NanoFi
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="btn-ghost">Features</a>
            <a href="#how-it-works" className="btn-ghost">How It Works</a>
            <a href="#roadmap" className="btn-ghost">Roadmap</a>
          </div>
          <Link href="/app" className="btn-primary text-sm">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero — video background */}
      <section className="relative flex min-h-[85dvh] flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0a0a0b]/50" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/[0.06] via-transparent to-[#0a0a0b]" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="font-display text-display-xl font-bold tracking-tight text-white text-balance">
            <span className="whitespace-nowrap">Transforming Scientific IP</span>
            <br />
            <span className="text-cyan-400">into Investable Assets</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 text-balance">
            Bridging Scientific, Blockchain, and Finance. Unlock patent value on Solana.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#features" className="btn-secondary px-8 py-3.5 text-base">
              Explore
            </a>
          </div>
        </div>
      </section>

      {/* Problem + value prop */}
      <section className="border-t border-white/[0.06] bg-zinc-950/40 py-16 px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-display text-6xl font-bold text-cyan-400/90 md:text-7xl">78%</p>
              <p className="mt-3 text-lg font-medium text-white">Of patents never reach the market.</p>
              <p className="mt-4 text-sm text-zinc-500">
                NanoFi turns dormant IP into liquid, revenue-generating assets on Solana.
              </p>
              <Link href="/app" className="btn-primary mt-6 inline-block text-sm">
                Launch App
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-800/80 md:aspect-auto md:h-[280px]">
              <Image src="/images/problem.png" alt="Scientific IP value" fill className="object-cover" />
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-zinc-400 text-sm leading-relaxed">
            Tokenize scientific patents as IP-NFTs. Inventors get liquidity; investors earn yield via on-chain trading, staking, and lending.
          </p>
        </div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="border-t border-white/[0.06] py-16 px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-display-md font-bold text-white">
            Features
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-500">
            Streamline the full IP lifecycle.
          </p>
          <div className="relative mt-10 grid w-full grid-cols-1 auto-rows-auto gap-2 sm:grid-cols-6 sm:grid-rows-6 sm:h-[80vh] sm:min-h-[500px]">
            {[
              { name: "Patent Vault", desc: "Tokenize scientific patents into IP-NFTs for secure, on-chain DeFi utility.", href: "/app/vault", bento: "sm:col-span-6 sm:col-start-1 sm:row-span-2 sm:row-start-1", cardImage: "/images/vault-door.png" },
              { name: "Patent Backed-Lending", desc: "Collateralize IP-NFTs to access instant funding for development.", href: "/app/lending", bento: "sm:col-span-2 sm:col-start-1 sm:row-span-4 sm:row-start-3", cardImage: "/images/lending-card.png" },
              { name: "Yield and Staking", desc: "Earn ecosystem yield from patent revenues and marketplace activity.", href: "/app/staking", bento: "sm:col-span-4 sm:col-start-3 sm:row-span-2 sm:row-start-3", cardImage: "/images/staking-card.png" },
              { name: "Patent Funding", desc: "Expert-vetted funding to commercialize your IP.", href: "/app/funding", bento: "sm:col-span-2 sm:col-start-3 sm:row-span-2 sm:row-start-5", cardImage: "/images/funding-card.png", compact: true },
              { name: "IP Marketplace", desc: "Trade, license, and fractionalize patent assets.", href: "/app/marketplace", bento: "sm:col-span-2 sm:col-start-5 sm:row-span-2 sm:row-start-5", cardImage: "/images/marketplace-card.png", compact: true },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group gallery__item relative col-span-1 flex min-h-[180px] flex-col justify-end overflow-hidden rounded-[4px] border-0 bg-zinc-900/80 p-6 text-left transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 sm:min-h-0 ${item.bento}`}
              >
                {item.cardImage && (
                  <>
                    <Image src={item.cardImage} alt="" fill className="object-cover object-center opacity-55" />
                    <span className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/50 to-transparent" aria-hidden />
                  </>
                )}
                <span
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border-0 bg-white/10 text-zinc-400 transition-colors group-hover:bg-cyan-500/20 group-hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  aria-hidden
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" x2="21" y1="10" y2="3" />
                    <line x1="3" x2="10" y1="21" y2="14" />
                  </svg>
                </span>
                <h3 className={`relative z-10 font-display font-bold text-white group-hover:text-cyan-400/90 transition-colors ${item.compact ? "text-lg sm:text-xl line-clamp-1" : "text-xl sm:text-2xl"}`}>{item.name}</h3>
                <p className={`relative z-10 mt-3 leading-relaxed text-zinc-500 ${item.compact ? "text-sm line-clamp-2" : "text-base"}`}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-white/[0.06] bg-zinc-950/50 py-16 px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-display-md font-bold text-white">
            How it works
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-zinc-500">
            Tokenize, list, and monetize IP in five steps.
          </p>
          <div className="relative mt-10 aspect-[2/1] max-h-[320px] w-full overflow-hidden rounded-xl border border-zinc-800/80 md:max-h-[280px]">
            <Image src="/images/how-it-works.png" alt="How NanoFi works" fill className="object-cover opacity-80" />
          </div>
          <div className="relative mt-10">
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-zinc-700/80 md:block" aria-hidden />
            <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 md:overflow-visible md:grid md:grid-cols-5 md:gap-4">
              {[
                { step: "01", title: "Submit IP", desc: "High-readiness patents (TRL 7–9) for review." },
                { step: "02", title: "Mint IP-NFT", desc: "Approved patents structured and minted on-chain." },
                { step: "03", title: "Investors fund", desc: "Lending & Funding backed by verified IP." },
                { step: "04", title: "Commercialize", desc: "Deploy funds to production and launch." },
                { step: "05", title: "Revenue on-chain", desc: "Fees and sales distributed via smart contracts." },
              ].map((item) => (
                <div key={item.step} className="relative flex min-w-[200px] shrink-0 flex-col items-center md:min-w-0">
                  <span className="relative z-10 font-display text-2xl font-bold text-cyan-400/90">{item.step}</span>
                  <div className="mt-3 w-full rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3 text-center md:mt-4">
                    <h3 className="font-display text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/[0.06] py-16 px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-display-md font-bold text-white">
            Trusted by innovators
          </h2>
          <div className="relative mx-auto mt-8 max-w-2xl overflow-hidden rounded-xl border border-zinc-800/80">
            <Image src="/images/testimonials.png" alt="" width={672} height={280} className="h-44 w-full object-cover opacity-90 md:h-52" />
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { name: "Sarah Chen", role: "CTO, TechFlow", quote: "Unlocked the value of our patent portfolio. Seamless and intuitive." },
              { name: "Michael Rodriguez", role: "VP Engineering", quote: "Tokenized multiple scientific patents. Reliability and support exceptional." },
              { name: "Emily Watson", role: "Founder, Startup Labs", quote: "IP financing made accessible. New funding streams for our research." },
            ].map((t) => (
              <div key={t.name} className="card p-6">
                <p className="text-sm text-zinc-400">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 font-display text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chainlink — oracle-style, less boxy */}
      <section className="border-t border-white/[0.06] bg-zinc-950/50 py-14 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="oracle-glow relative mb-8 mx-auto max-w-3xl overflow-hidden rounded-2xl border border-cyan-500/20 md:rounded-3xl" style={{ aspectRatio: "2.4/1" }}>
            <Image src="/images/chainlink.jpg" alt="Powered by Chainlink" fill className="object-cover object-center opacity-90" sizes="(max-width: 768px) 100vw, 48rem" />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/40 via-transparent to-transparent" aria-hidden />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(34,211,238,0.08),transparent_70%)]" aria-hidden />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-display-md font-bold text-white">
              Powered by Chainlink
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Real-time feeds, automated liquidation, off-chain verification.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Real-time valuation", "Auto liquidation", "Off-chain verification"].map((title) => (
                <span key={title} className="rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-4 py-2 text-sm text-white">
                  {title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="border-t border-white/[0.06] py-16 px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-display-md font-bold text-white">
            Roadmap
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-zinc-500">
            From MVP to scale.
          </p>
          <div className="relative mt-8 aspect-[2/1] max-h-[260px] w-full overflow-hidden rounded-xl border border-zinc-800/80">
            <Image src="/images/roadmap.jpg" alt="NanoFi roadmap" fill className="object-cover opacity-80" />
          </div>
          <div className="relative mt-10">
            <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-zinc-700/80 md:block" aria-hidden />
            <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 md:overflow-visible md:grid md:grid-cols-4 md:gap-6">
              {[
                { phase: "MVP", desc: "Vault, lending, Chainlink, staking, marketplace.", here: true },
                { phase: "AI Risk Engine", desc: "On-chain risk for collateral.", here: false },
                { phase: "Institutional Pools", desc: "Compliance-ready infrastructure.", here: false },
                { phase: "Cross-Chain (CCIP)", desc: "Multi-chain IP and liquidity.", here: false },
              ].map((item, i) => (
                <div key={item.phase} className="relative flex min-w-[220px] shrink-0 flex-col items-center md:min-w-0">
                  <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${item.here ? "border-cyan-400 bg-cyan-500/20 text-cyan-400" : "border-zinc-600 bg-zinc-900/80 text-zinc-400"}`}>
                    {i + 1}
                  </span>
                  <div className="mt-3 w-full rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3 text-center md:mt-4">
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      <span className="font-display text-sm font-semibold text-white">{item.phase}</span>
                      {item.here && (
                        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/[0.06] py-16 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <Image src="/images/cta.png" alt="" fill className="object-cover opacity-20" />
        </div>
        <div className="relative z-10 mx-auto max-w-xl text-center">
          <h2 className="font-display text-display-md font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            Join innovators turning IP into investable assets.
          </p>
          <Link href="/app" className="btn-primary mt-6 inline-block px-8 py-3.5">
            Launch App
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-zinc-950/80 py-14 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="font-display text-lg font-semibold text-white">
                NanoFi
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                Transforming scientific IP into investable assets on Solana.
              </p>
            </div>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Products
              </p>
              <ul className="mt-4 space-y-2.5">
                <li><Link href="/app/vault" className="text-sm text-zinc-500 transition hover:text-white">Vault</Link></li>
                <li><Link href="/app/lending" className="text-sm text-zinc-500 transition hover:text-white">Lending</Link></li>
                <li><Link href="/app/funding" className="text-sm text-zinc-500 transition hover:text-white">Funding</Link></li>
                <li><Link href="/app/staking" className="text-sm text-zinc-500 transition hover:text-white">Staking</Link></li>
                <li><Link href="/app/marketplace" className="text-sm text-zinc-500 transition hover:text-white">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Resources
              </p>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm text-zinc-500 transition hover:text-white">Whitepaper</a></li>
                <li><a href="#" className="text-sm text-zinc-500 transition hover:text-white">Docs</a></li>
                <li><a href="#" className="text-sm text-zinc-500 transition hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-sm text-zinc-500 transition hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
            <span className="text-xs text-zinc-600">
              © {new Date().getFullYear()} NanoFi. All rights reserved.
            </span>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-zinc-500 transition hover:text-white">Terms</a>
              <a href="#" className="text-xs text-zinc-500 transition hover:text-white">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
