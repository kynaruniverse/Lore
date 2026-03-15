// LORE — 404 Not Found Page — Ember Archive Design

import { Link } from "wouter";
import { Flame, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ember-glow">
          <Flame className="w-8 h-8 text-primary" />
        </div>
        <p className="text-6xl font-bold text-primary/30 mb-2" style={{ fontFamily: "'Lora', Georgia, serif" }}>
          404
        </p>
        <h1
          className="text-2xl font-bold text-foreground mb-3"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm mb-8">
          This knowledge page doesn't exist yet — or it may have been moved. Perhaps you'd like to create it?
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-[oklch(0.68_0.20_42)] transition-colors ember-glow">
              <ArrowLeft className="w-4 h-4" />
              Back to Discovery
            </button>
          </Link>
          <Link href="/create">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/40 transition-colors">
              Start a Lore
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
