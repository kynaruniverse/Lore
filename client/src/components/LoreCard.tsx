import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Clock, Flame, Users, FileText } from "lucide-react";
import { categoryIcons } from "@/lib/data";
import type { Lore } from "@/lib/data";

interface LoreCardProps {
  lore: Lore;
  index: number;
}

export default function LoreCard({ lore, index }: LoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
    >
      <Link href={`/lore/${lore.slug}`}>
        <div className="lore-card overflow-hidden group">
          {/* Cover image */}
          <div className="relative h-36 overflow-hidden">
            <img
              src={lore.coverImage}
              alt={lore.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            {lore.trending && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-primary/90 rounded-full text-primary-foreground text-[10px] font-medium">
                <TrendingUp className="w-2.5 h-2.5" />
                Trending
              </div>
            )}
            <div className="absolute bottom-2 left-3">
              <span className="text-lg">{categoryIcons[lore.category]}</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3
              className="font-semibold text-foreground text-base mb-1 group-hover:text-primary transition-colors"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              {lore.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{lore.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {lore.pageCount} pages
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {lore.contributorCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
