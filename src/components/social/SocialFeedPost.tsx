"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { SocialPost } from "@/data/socialFeedData";
import { useApp } from "@/context/AppContext";

interface SocialFeedPostProps {
  post: SocialPost;
  onOpenComments: (post: SocialPost) => void;
}

export const SocialFeedPost: React.FC<SocialFeedPostProps> = ({
  post,
  onOpenComments,
}) => {
  const { showNotification } = useApp();

  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [hasSaved, setHasSaved] = useState(post.hasSaved || false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [quickCommentText, setQuickCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  // Sync internal state when parent post changes (e.g. comment added from comments drawer)
  useEffect(() => {
    setCommentsList(post.comments);
    setCommentsCount(post.commentsCount);
  }, [post.comments, post.commentsCount]);

  const lastTapRef = useRef<number>(0);

  const handleLike = () => {
    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!hasLiked) {
        setHasLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 800);
    }
    lastTapRef.current = now;
  };

  const handleSave = () => {
    const nextSaved = !hasSaved;
    setHasSaved(nextSaved);
    showNotification(
      nextSaved ? "Saved to your private Health Vault collection!" : "Removed from saved posts."
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${post.creatorName} on HerBook`,
          text: post.caption,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification("Post link copied to clipboard!");
    }
  };

  const handleQuickCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCommentText.trim()) return;

    const newComment = {
      id: `comm-quick-${Date.now()}`,
      username: "rhea_deshmukh",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      text: quickCommentText.trim(),
      timestamp: "Just now",
      likes: 0,
    };

    setCommentsList((prev) => [...prev, newComment]);
    setCommentsCount((prev) => prev + 1);
    setQuickCommentText("");
    showNotification("Comment added!");
  };

  const addEmoji = (emoji: string) => {
    setQuickCommentText((prev) => prev + emoji);
  };

  return (
    <article className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200/80 dark:border-zinc-800 sm:rounded-3xl shadow-card transition-colors overflow-hidden">
      {/* 1. Post Header */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.creatorAvatar}
              alt={post.creatorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-rose/30"
            />
            {post.isCreatorVerified && (
              <span
                className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-brand-success text-white rounded-full shadow-xs"
                title="Clinician Verified"
              >
                <ShieldCheck className="w-3 h-3" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                {post.creatorHandle}
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-[11px] text-zinc-400 font-medium">{post.timestamp}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-brand-plum dark:text-brand-rose-light">
                {post.creatorName}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-brand-blush dark:bg-brand-plum/30 text-brand-plum dark:text-brand-rose">
                {post.category}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => showNotification("Post options: Follow creator, share link, report content.")}
          className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Post Media with Double-Tap to Like */}
      <div
        className="relative aspect-square sm:aspect-[4/3] bg-zinc-950 overflow-hidden cursor-pointer select-none"
        onClick={handleDoubleTap}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.mediaUrls[carouselIndex] || post.mediaUrls[0]}
          alt={post.caption}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Floating Heart Pop Animation on Double Tap */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-ping">
            <Heart className="w-24 h-24 text-brand-rose fill-brand-rose drop-shadow-2xl" />
          </div>
        )}

        {/* Carousel indicators if multiple photos */}
        {post.mediaUrls.length > 1 && (
          <>
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white">
              {carouselIndex + 1}/{post.mediaUrls.length}
            </div>

            {carouselIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselIndex((prev) => prev - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {carouselIndex < post.mediaUrls.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselIndex((prev) => prev + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* 3. Post Action Rail */}
      <div className="p-3.5 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 group transition-transform active:scale-125"
              aria-label="Like post"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  hasLiked ? "text-brand-rose fill-brand-rose" : "text-zinc-700 dark:text-zinc-300 stroke-[1.8]"
                }`}
              />
            </button>

            {/* Comment */}
            <button
              onClick={() => onOpenComments(post)}
              className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 transition-transform active:scale-110"
              aria-label="View comments"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.8]" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="text-zinc-700 dark:text-zinc-300 transition-transform active:scale-110"
              aria-label="Share post"
            >
              <Share2 className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Bookmark / Save */}
          <button
            onClick={handleSave}
            className="transition-transform active:scale-125"
            aria-label="Save post"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                hasSaved ? "text-amber-500 fill-amber-500" : "text-zinc-700 dark:text-zinc-300 stroke-[1.8]"
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="text-xs font-bold text-zinc-900 dark:text-white">
          {likesCount.toLocaleString()} likes
        </div>

        {/* Caption & Hashtags */}
        <div className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
          <span className="font-bold mr-1.5 text-zinc-900 dark:text-white">
            {post.creatorHandle}
          </span>
          <span className={isCaptionExpanded ? "" : "line-clamp-2"}>
            {post.caption}
          </span>
          {post.caption.length > 120 && (
            <button
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-semibold ml-1 inline-block"
            >
              {isCaptionExpanded ? "less" : "more"}
            </button>
          )}

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-brand-plum dark:text-brand-rose font-medium">
            {post.hashtags.map((h) => (
              <span key={h}>#{h}</span>
            ))}
          </div>
        </div>

        {/* Linked Health Action (Connecting Social Feed to Healthcare Services) */}
        {post.linkedAction && (
          <div className="pt-1">
            <Link
              href={
                post.linkedAction.type === "consult"
                  ? `/consult/${post.linkedAction.targetId || ""}`
                  : post.linkedAction.type === "track"
                  ? "/track"
                  : post.linkedAction.type === "pcos"
                  ? "/pcos"
                  : "/shop"
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blush dark:bg-brand-plum/30 hover:bg-brand-rose/20 text-brand-plum dark:text-brand-rose-light text-xs font-bold border border-brand-rose/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-rose" />
              <span>{post.linkedAction.label}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        )}

        {/* View all comments button */}
        {commentsCount > 0 ? (
          <button
            onClick={() => onOpenComments(post)}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 block pt-0.5 cursor-pointer"
          >
            View all {commentsCount} comments
          </button>
        ) : (
          <button
            onClick={() => onOpenComments(post)}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 block pt-0.5 italic cursor-pointer"
          >
            No comments yet • Add a comment...
          </button>
        )}

        {/* Inline Quick Comment Input with Emojis */}
        <form
          onSubmit={handleQuickCommentSubmit}
          className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2"
        >
          <div className="flex items-center gap-1 text-sm shrink-0">
            {["❤️", "🌸", "👏", "🫂"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="hover:scale-125 transition-transform p-0.5"
              >
                {emoji}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={quickCommentText}
            onChange={(e) => setQuickCommentText(e.target.value)}
            placeholder="Add a supportive comment..."
            className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
          />

          {quickCommentText.trim() && (
            <button
              type="submit"
              className="text-xs font-bold text-brand-rose hover:text-brand-rose-dark transition-colors shrink-0"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};
