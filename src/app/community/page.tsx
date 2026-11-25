"use client";

import React, { useState, useMemo } from "react";
import { Users, Plus, Search, ShieldCheck, Heart, Sparkles, MessageCircle } from "lucide-react";
import { useCommunity } from "@/context/CommunityContext";
import { useApp } from "@/context/AppContext";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { CreatePostModal } from "@/components/community/CreatePostModal";
import { COMMUNITY_TOPICS } from "@/data/communityData";

export default function CommunityPage() {
  const { posts } = useCommunity();
  const { t } = useApp();

  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedTopic !== "All Topics" && post.topic !== selectedTopic) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchContent = post.content.toLowerCase().includes(q);
        const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchTags) return false;
      }

      return true;
    });
  }, [posts, selectedTopic, searchQuery]);

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-3 sm:px-4 py-3 space-y-4 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
              HerCircle Moderated Forums
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            <span className="text-xs text-zinc-500 font-medium">Safe &amp; Confidential</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display mt-0.5">
            {t.community.title}
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            {t.community.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.community.createPost}</span>
        </button>
      </div>

      {/* Sisterhood Guidelines Banner */}
      <div className="p-4 rounded-3xl bg-brand-blush/60 dark:bg-zinc-900 border border-brand-rose/20 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-plum dark:text-brand-rose shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-zinc-900 dark:text-white block mb-0.5">
            Community Guidelines &amp; Absolute Privacy Isolation:
          </strong>
          <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
            HerCircle is a space of empathy and respect. You can post anonymously at any time. Your private menstrual cycle records and health files are isolated on the server and are <strong>NEVER</strong> exposed to community forums. Peer experiences do not substitute for formal clinical diagnosis.
          </span>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {COMMUNITY_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTopic === topic
                ? "bg-brand-plum text-white border-brand-plum shadow-soft"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-brand-rose"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search discussions by keyword, question, or tag..."
          className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose shadow-card"
        />
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              No conversations found under this topic yet.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-brand-rose text-white text-xs font-bold"
            >
              Start the Conversation
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
