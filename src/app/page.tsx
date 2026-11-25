"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Filter, RefreshCw, Plus } from "lucide-react";
import { initialSocialPosts, SocialPost } from "@/data/socialFeedData";
import { SocialFeedPost } from "@/components/social/SocialFeedPost";
import { QuickCareStrip } from "@/components/social/QuickCareStrip";
import { PostCommentsDrawer } from "@/components/social/PostCommentsDrawer";
import { useApp } from "@/context/AppContext";

export default function HomePage() {
  const { user, showNotification, setIsCreateContentOpen } = useApp();

  const [feedTab, setFeedTab] = useState<"for_you" | "following" | "health">("for_you");
  const [posts, setPosts] = useState<SocialPost[]>(initialSocialPosts);
  const [activeCommentsPost, setActiveCommentsPost] = useState<SocialPost | null>(null);

  // Restore modified posts (with user comments) from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("herbook_social_posts");
      if (saved) {
        setPosts(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const savePostsState = (newPosts: SocialPost[]) => {
    setPosts(newPosts);
    try {
      localStorage.setItem("herbook_social_posts", JSON.stringify(newPosts));
    } catch {}
  };

  const filteredPosts = useMemo(() => {
    if (feedTab === "for_you") return posts;
    if (feedTab === "following") {
      return posts.filter((p) => p.feedCategory === "following" || p.feedCategory === "for_you");
    }
    return posts.filter((p) => p.feedCategory === "health");
  }, [posts, feedTab]);

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      username: user?.username || "user",
      avatar: user?.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      text,
      timestamp: "Just now",
      likes: 0,
    };

    const nextPosts = posts.map((p) => {
      if (p.id === postId) {
        const updatedComments = [...p.comments, newComment];
        return {
          ...p,
          comments: updatedComments,
          commentsCount: p.commentsCount + 1,
        };
      }
      return p;
    });

    savePostsState(nextPosts);

    if (activeCommentsPost && activeCommentsPost.id === postId) {
      setActiveCommentsPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, newComment],
              commentsCount: prev.commentsCount + 1,
            }
          : null
      );
    }

    showNotification("Comment published!");
  };

  return (
    <div className="max-w-md sm:max-w-lg mx-auto pb-6 space-y-4 animate-fadeIn">
      {/* 1. Feed Category Selector (For You • Following • Health) */}
      <div className="sticky top-14 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md py-2.5 px-4 border-b border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setFeedTab("for_you")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              feedTab === "for_you"
                ? "bg-brand-plum text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            For You
          </button>

          <button
            type="button"
            onClick={() => setFeedTab("following")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              feedTab === "following"
                ? "bg-brand-plum text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Following
          </button>

          <button
            type="button"
            onClick={() => setFeedTab("health")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              feedTab === "health"
                ? "bg-brand-plum text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Health
          </button>
        </div>

        {/* Small New Post action shortcut */}
        <button
          onClick={() => setIsCreateContentOpen(true)}
          className="text-brand-plum dark:text-brand-rose text-xs font-bold flex items-center gap-1 hover:opacity-80"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </div>

      {/* 2. Compact Quick Care Strip (Replacing traditional Instagram stories row) */}
      <div className="px-3 sm:px-0">
        <QuickCareStrip />
      </div>

      {/* 3. Main Social Feed (Instagram-Style Vertical Stream) */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <SocialFeedPost
            key={post.id}
            post={post}
            onOpenComments={(p) => setActiveCommentsPost(p)}
          />
        ))}
      </div>

      {/* Comments Drawer */}
      <PostCommentsDrawer
        post={activeCommentsPost}
        isOpen={!!activeCommentsPost}
        onClose={() => setActiveCommentsPost(null)}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
