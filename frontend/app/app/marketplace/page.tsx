"use client";

import { useState } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";

const SECTORS = ["All", "Healthcare", "Energy", "Industrial", "Software"];
const TAB_OPTIONS = [{ id: "all", label: "For You" }, { id: "Healthcare", label: "Healthcare" }, { id: "Energy", label: "Energy" }, { id: "Industrial", label: "Industrial" }, { id: "Software", label: "Software" }];

const SERVICE_TAB_OPTIONS = [
  { id: "all", label: "For You" },
  { id: "Consulting", label: "Consulting" },
  { id: "Research", label: "Research" },
  { id: "Analysis", label: "Analysis" },
  { id: "Licensing", label: "Licensing" },
];

const LISTINGS = [
  { id: "1", name: "Product A", price: "299", sector: "Healthcare", patentOrigin: "US-12345", revenue: "12.5K", licensing: "Exclusive", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop", sold: "120+" },
  { id: "2", name: "Product B", price: "499", sector: "Energy", patentOrigin: "EP-67890", revenue: "28K", licensing: "Non-exclusive", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop", sold: "85+" },
  { id: "3", name: "Product C", price: "199", sector: "Industrial", patentOrigin: "US-11111", revenue: "8K", licensing: "License", image: "https://images.unsplash.com/photo-1581091226823-a80c0a82b8b2?w=400&h=400&fit=crop", sold: "45+" },
  { id: "4", name: "Product D", price: "349", sector: "Healthcare", patentOrigin: "US-22222", revenue: "18K", licensing: "Exclusive", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop", sold: "60+" },
  { id: "5", name: "Product E", price: "599", sector: "Software", patentOrigin: "EP-33333", revenue: "42K", licensing: "Non-exclusive", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop", sold: "200+" },
  { id: "6", name: "Product F", price: "249", sector: "Energy", patentOrigin: "US-44444", revenue: "9K", licensing: "License", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop", sold: "30+" },
];

const SERVICES = [
  { id: "s1", name: "Patent feasibility review", scientist: "Dr. Elena Vasquez", role: "PhD Nanotech", category: "Consulting", price: "450", description: "Expert review of patent strength and commercial potential.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop", booked: "28+" },
  { id: "s2", name: "Lab validation & testing", scientist: "Prof. James Chen", role: "Materials Science", category: "Research", price: "1,200", description: "Lab validation and test reports for IP commercialization.", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop", booked: "15+" },
  { id: "s3", name: "Prior art & FTO analysis", scientist: "Dr. Sarah Kim", role: "Patent Attorney", category: "Analysis", price: "680", description: "Freedom-to-operate and prior art search and report.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop", booked: "42+" },
  { id: "s4", name: "Licensing strategy", scientist: "Dr. Marcus Webb", role: "IP Strategy", category: "Licensing", price: "550", description: "Licensing strategy and term-sheet guidance.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop", booked: "22+" },
  { id: "s5", name: "R&D roadmap workshop", scientist: "Dr. Yuki Tanaka", role: "Biotech R&D", category: "Consulting", price: "800", description: "Half-day workshop for R&D and IP roadmap.", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop", booked: "18+" },
  { id: "s6", name: "Technical due diligence", scientist: "Prof. Anna Berg", role: "Clean Energy", category: "Analysis", price: "950", description: "Technical due diligence for investors or acquirers.", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop", booked: "12+" },
];

export default function MarketplacePage() {
  const { connected } = useWallet();
  const [view, setView] = useState<"products" | "services">("products");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeServiceTab, setActiveServiceTab] = useState<string>("all");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const selected = LISTINGS.find((l) => l.id === selectedId);
  const filtered = activeTab === "all" ? LISTINGS : LISTINGS.filter((l) => l.sector === activeTab);

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId);
  const filteredServices = activeServiceTab === "all" ? SERVICES : SERVICES.filter((s) => s.category === activeServiceTab);

  return (
    <div>
      <p className="section-label">Marketplace</p>
      <h1 className="heading-display mt-2 text-display-md">Buy or sell products</h1>
      <p className="mt-3 text-zinc-400">
        Explore products and services. Track revenue and distributions.
      </p>

      {!connected ? (
        <div className="card mt-10 p-8 text-center text-zinc-400">
          Connect your Solana wallet to use the Marketplace.
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("products")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === "products" ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:bg-white/5"}`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => setView("services")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === "services" ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:bg-white/5"}`}
            >
              Services
            </button>
          </div>

          {view === "products" && (
            <>
              <div className="card p-6 sm:p-8">
                <h2 className="heading-2 text-white">Explore products</h2>
                <p className="mt-1 text-sm text-zinc-500">Filter by sector, revenue performance, licensing type.</p>

                {/* Tab bar — horizontal scroll like Tokopedia */}
                <div className="mt-6 flex overflow-x-auto border-b border-zinc-800 pb-px scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700" role="tablist">
                  {TAB_OPTIONS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === tab.id ? "border-cyan-400 text-cyan-400" : "border-transparent text-zinc-400 hover:text-white"}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Product grid — image-on-top cards */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedId(l.id)}
                      className="group flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/50 text-left transition hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-zinc-800">
                        <Image src={l.image} alt={l.name} width={400} height={400} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        {l.licensing === "Exclusive" && (
                          <span className="absolute left-2 top-2 rounded bg-cyan-500/90 px-2 py-0.5 text-xs font-medium text-white">Exclusive</span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <span className="rounded bg-zinc-700/80 px-2 py-0.5 text-xs text-zinc-300 w-fit">{l.sector}</span>
                        <h3 className="mt-2 line-clamp-2 font-display font-semibold text-white group-hover:text-cyan-400/90 transition-colors">{l.name}</h3>
                        <p className="mt-2 text-xl font-semibold text-cyan-400">${l.price}</p>
                        <p className="mt-1 text-sm text-zinc-500">Patent: {l.patentOrigin} · ${l.revenue} revenue</p>
                        <p className="mt-0.5 text-xs text-zinc-600">Licensing: {l.licensing}</p>
                        <p className="mt-2 text-xs text-zinc-500">{l.sold} licensed</p>
                        <span className="btn-primary mt-4 w-full text-center text-sm">View detail</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selected && (
                <div className="card p-8">
                  <h2 className="heading-2">Product detail · {selected.name}</h2>
                  <p className="mt-2 text-sm text-zinc-400">Description, technology background, patent link, royalty model, license terms.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-zinc-500">Price</p>
                      <p className="text-xl font-semibold text-cyan-400">${selected.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Patent origin</p>
                      <p className="font-medium text-white">{selected.patentOrigin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Revenue metrics</p>
                      <p className="font-medium text-white">${selected.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Licensing</p>
                      <p className="font-medium text-white">{selected.licensing}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button type="button" className="btn-primary">Purchase</button>
                    <button type="button" className="btn-secondary">View license terms</button>
                  </div>
                </div>
              )}
            </>
          )}

          {view === "services" && (
            <>
              <div className="card p-6 sm:p-8">
                <h2 className="heading-2 text-white">Explore services</h2>
                <p className="mt-1 text-sm text-zinc-500">Jasa dari scientist: konsultasi, riset, analisis, dan dukungan lisensi.</p>

                <div className="mt-6 flex overflow-x-auto border-b border-zinc-800 pb-px scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700" role="tablist">
                  {SERVICE_TAB_OPTIONS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeServiceTab === tab.id}
                      onClick={() => setActiveServiceTab(tab.id)}
                      className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${activeServiceTab === tab.id ? "border-cyan-400 text-cyan-400" : "border-transparent text-zinc-400 hover:text-white"}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredServices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      className="group flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/50 text-left transition hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-zinc-800">
                        <Image src={s.image} alt={s.name} width={400} height={400} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <span className="absolute left-2 top-2 rounded bg-zinc-800/90 px-2 py-0.5 text-xs font-medium text-white">{s.role}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <span className="rounded bg-zinc-700/80 px-2 py-0.5 text-xs text-zinc-300 w-fit">{s.category}</span>
                        <h3 className="mt-2 line-clamp-2 font-display font-semibold text-white group-hover:text-cyan-400/90 transition-colors">{s.name}</h3>
                        <p className="mt-1 text-sm text-zinc-400">{s.scientist}</p>
                        <p className="mt-2 text-xl font-semibold text-cyan-400">${s.price}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{s.description}</p>
                        <p className="mt-2 text-xs text-zinc-500">{s.booked} booked</p>
                        <span className="btn-primary mt-4 w-full text-center text-sm">View detail</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedService && (
                <div className="card p-8">
                  <h2 className="heading-2 text-white">Service detail · {selectedService.name}</h2>
                  <p className="mt-2 text-sm text-zinc-400">Deskripsi lengkap, kualifikasi scientist, dan cara booking.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-zinc-500">Scientist</p>
                      <p className="font-medium text-white">{selectedService.scientist}</p>
                      <p className="text-sm text-zinc-500">{selectedService.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Category</p>
                      <p className="font-medium text-white">{selectedService.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Price</p>
                      <p className="text-xl font-semibold text-cyan-400">${selectedService.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Description</p>
                      <p className="font-medium text-white">{selectedService.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button type="button" className="btn-primary">Book service</button>
                    <button type="button" className="btn-secondary">Contact scientist</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
