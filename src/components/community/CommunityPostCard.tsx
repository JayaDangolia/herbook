"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Flag,
  Share2,
  Shield,
  Send,
  UserCheck,
} from "lucide-react";
import { CommunityPost } from "@/data/communityData";
import { useCommunity } from "@/context/CommunityContext";
import { useApp } from "@/context/AppContext";

interface CommunityPostCardProps {
  post: CommunityPost;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post }) => {
  const { likePost, savePost, addComment, reportPost } = useCommunity();
  const { showNotification } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentAsAnonymous, setCommentAsAnonymous] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim(), commentAsAnonymous);
    setCommentText("");
    showNotification("Reply added to discussion!");
  };

  const handleReport = () => {
    reportPost(post.id, "Flagged for moderator review");
    showNotification("Post reported to community moderators. Thank you for keeping HerCircle safe!");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-card space-y-4 transition-colors">
      {/* Header: Author or Anonymous Badge, Topic, Date */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-3">
          {post.isAnonymous ? (
            <div className="w-10 h-10 rounded-2xl bg-brand-lavender/20 text-brand-lavender-dark flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700"
            />
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                {post.authorName}
              </span>
              {post.isAnonymous && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                  Incognito
                </span>
              )}
            </div>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
              {post.createdAt}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-blush dark:bg-brand-plum/30 text-brand-plum dark:text-brand-rose-light border border-brand-rose/20">
          {post.topic}
        </span>
      </div>

      {/* Title & Body */}
      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
          {post.title}
        </h3>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] text-brand-plum dark:text-brand-rose-light font-medium bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Bottom Actions: Like, Comment, Save, Report */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
        <div className="flex items-center space-x-4">
          {/* Like */}
          <button
            onClick={() => likePost(post.id)}
            className={`flex items-center space-x-1.5 font-semibold transition-colors ${
              post.hasLiked
                ? "text-brand-rose"
                : "text-zinc-500 hover:text-brand-rose"
            }`}
          >
            <Heart className={`w-4 h-4 ${post.hasLiked ? "fill-brand-rose" : ""}`} />
            <span>{post.likesCount}</span>
          </button>

          {/* Comment toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1.5 font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => savePost(post.id)}
            className={`flex items-center space-x-1.5 font-semibold transition-colors ${
              post.hasSaved
                ? "text-amber-500"
                : "text-zinc-500 hover:text-amber-500"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${post.hasSaved ? "fill-amber-500" : ""}`} />
            <span>{post.savesCount}</span>
          </button>
        </div>

        <button
          onClick={handleReport}
          className="text-zinc-400 hover:text-brand-error transition-colors p-1"
          title="Report Violation"
        >
          <Flag className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comments Thread Section */}
      {showComments && (
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3 animate-fadeIn">
          {/* Existing comments */}
          {post.comments.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {post.comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {comm.authorName}
                    </span>
                    <span className="text-[10px] text-zinc-400">{comm.createdAt}</span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">{comm.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">No responses yet. Start the conversation!</p>
          )}

          {/* Add Reply Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={commentAsAnonymous}
                  onChange={(e) => setCommentAsAnonymous(e.target.checked)}
                  className="w-3.5 h-3.5 accent-brand-rose rounded"
                />
                <span>Reply anonymously</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your experience or words of support..."
                className="flex-1 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-brand-rose text-white hover:bg-brand-rose-dark transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
