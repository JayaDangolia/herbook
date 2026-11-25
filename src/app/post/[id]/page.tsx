"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PostCommentsDrawer } from "@/components/social/PostCommentsDrawer";
import { initialSocialPosts } from "@/data/socialFeedData";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, showNotification } = useApp();
  const postId = params?.id as string;

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      try {
        // First attempt to fetch from API
        const res = await fetch(`/api/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.post) {
            setPost({
              id: data.post.id,
              creatorName: data.post.authorName,
              creatorHandle: data.post.authorHandle,
              creatorAvatar: data.post.authorAvatar,
              isCreatorVerified: data.post.isVerified,
              caption: data.post.caption,
              category: data.post.category,
              mediaUrls: data.post.mediaUrls,
              likesCount: data.post.likesCount,
              commentsCount: data.post.commentsCount,
              comments: [],
              timestamp: "Recently",
            });
            setLikesCount(data.post.likesCount);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback to static catalog if local
      }

      // Fallback search in initial demo social posts
      const fallback = initialSocialPosts.find((p) => p.id === postId);
      if (fallback) {
        setPost(fallback);
        setLikesCount(fallback.likesCount);
        setHasLiked(fallback.hasLiked || false);
      }
      setIsLoading(false);
    }

    if (postId) loadPost();
  }, [postId]);

  const toggleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const toggleSave = () => {
    setHasSaved(!hasSaved);
    showNotification(!hasSaved ? "Post saved to private vault!" : "Post removed from saved.");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification("Post link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-rose border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-zinc-600 dark:text-zinc-400 font-semibold text-sm">Post not found or has been removed.</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft"
        >
          Return to Home Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-0 py-4 pb-24 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-extrabold text-sm text-zinc-900 dark:text-white font-display">Post</span>
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Post Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-soft overflow-hidden">
        {/* Creator Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center space-x-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.creatorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
              alt={post.creatorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-rose/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {post.creatorName}
                </span>
                {post.isCreatorVerified && (
                  <span title="Verified Healthcare Professional">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500">@{post.creatorHandle || "herbook_creator"} • {post.timestamp}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-blush/60 dark:bg-brand-plum/20 text-brand-plum dark:text-brand-rose">
            {post.category}
          </span>
        </div>

        {/* Media */}
        {post.mediaUrls && post.mediaUrls[0] && (
          <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.mediaUrls[0]}
              alt={post.caption}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLike}
              className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-brand-rose transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  hasLiked ? "text-brand-rose fill-brand-rose" : "stroke-[1.8]"
                }`}
              />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={() => setIsCommentsOpen(true)}
              className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-brand-plum transition-colors"
            >
              <MessageCircle className="w-5 h-5 stroke-[1.8]" />
              <span>{post.commentsCount || 0}</span>
            </button>
            <button
              onClick={handleShare}
              className="text-zinc-700 dark:text-zinc-300 hover:text-brand-plum transition-colors"
            >
              <Share2 className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          <button
            onClick={toggleSave}
            className="text-zinc-700 dark:text-zinc-300 hover:text-brand-plum transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 ${
                hasSaved ? "text-brand-plum fill-brand-plum dark:text-brand-rose dark:fill-brand-rose" : "stroke-[1.8]"
              }`}
            />
          </button>
        </div>

        {/* Caption */}
        <div className="px-4 pb-4 pt-1 space-y-1.5 text-xs">
          <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
            <strong className="font-bold mr-1.5 text-zinc-900 dark:text-white">
              {post.creatorHandle || post.creatorName}
            </strong>
            {post.caption}
          </p>
        </div>
      </div>

      {/* Comments Drawer */}
      <PostCommentsDrawer
        post={{
          ...post,
          comments: post.comments || [],
          commentsCount: post.commentsCount || 0,
        }}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        onAddComment={(postId, newComment) => {
          showNotification("Comment published!");
        }}
      />
    </div>
  );
}
