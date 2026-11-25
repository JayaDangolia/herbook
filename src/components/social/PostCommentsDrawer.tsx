"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Heart, ShieldCheck, CornerDownRight, Smile } from "lucide-react";
import { SocialPost, SocialComment } from "@/data/socialFeedData";
import { OverlayDrawer } from "@/components/ui/OverlayDrawer";

interface PostCommentsDrawerProps {
  post: SocialPost | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export const PostCommentsDrawer: React.FC<PostCommentsDrawerProps> = ({
  post,
  isOpen,
  onClose,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ username: string; commentId: string } | null>(
    null
  );
  const [likedCommentIds, setLikedCommentIds] = useState<Record<string, boolean>>({});
  const [commentLikesCount, setCommentLikesCount] = useState<Record<string, number>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Initialize comment likes from post
  useEffect(() => {
    if (post) {
      const counts: Record<string, number> = {};
      post.comments.forEach((c) => {
        counts[c.id] = c.likes;
      });
      setCommentLikesCount(counts);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleToggleCommentLike = (commentId: string) => {
    const isLiked = !!likedCommentIds[commentId];
    setLikedCommentIds((prev) => ({ ...prev, [commentId]: !isLiked }));
    setCommentLikesCount((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + (isLiked ? -1 : 1),
    }));
  };

  const handleReplyClick = (comm: SocialComment) => {
    setReplyingTo({ username: comm.username, commentId: comm.id });
    setCommentText(`@${comm.username} `);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText("");
  };

  const addEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(post.id, commentText.trim());
    setCommentText("");
    setReplyingTo(null);

    // Scroll to bottom after new comment
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const quickEmojis = ["❤️", "🌸", "🙌", "👏", "🩺", "✨"];

  return (
    <OverlayDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Comments</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-rose/15 text-brand-plum dark:text-brand-rose">
            {post.comments.length}
          </span>
        </div>
      }
      maxWidth="max-w-lg"
      maxHeight="h-[82vh] sm:h-[650px]"
    >
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* Scrollable Comments List with Post Header */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 text-xs">
          {/* Post author and caption display */}
          <div className="flex items-start space-x-3 pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.creatorAvatar}
              alt={post.creatorName}
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-brand-rose/30 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-zinc-900 dark:text-white">
                  {post.creatorHandle}
                </span>
                {post.isCreatorVerified && (
                  <span title="Verified Healthcare Professional">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-success inline" />
                  </span>
                )}
                <span className="text-[10px] text-zinc-400">• {post.timestamp}</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mt-1 text-[13px]">
                {post.caption}
              </p>
            </div>
          </div>

          {/* User Comments Stream */}
          {post.comments.length > 0 ? (
            <div className="space-y-4 pt-1">
              {post.comments.map((comm) => {
                const isLiked = !!likedCommentIds[comm.id];
                const likes = commentLikesCount[comm.id] ?? comm.likes;

                return (
                  <div key={comm.id} className="flex items-start justify-between gap-3 group">
                    <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={comm.avatar}
                        alt={comm.username}
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-zinc-900 dark:text-white">
                            {comm.username}
                          </span>
                          <span className="text-[10px] text-zinc-400">{comm.timestamp}</span>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mt-0.5 break-words text-xs">
                          {comm.text}
                        </p>
                        <div className="flex items-center space-x-3.5 text-[11px] text-zinc-400 mt-1.5">
                          {likes > 0 && (
                            <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                              {likes} {likes === 1 ? "like" : "likes"}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleReplyClick(comm)}
                            className="font-bold text-zinc-600 dark:text-zinc-300 hover:text-brand-plum dark:hover:text-brand-rose transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCommentLike(comm.id)}
                      className="p-1 text-zinc-400 hover:text-brand-rose transition-colors self-start shrink-0"
                      aria-label="Like comment"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          isLiked ? "text-brand-rose fill-brand-rose" : "stroke-[1.8]"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
              <div ref={commentsEndRef} />
            </div>
          ) : (
            /* Explicit empty state per specification */
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-blush dark:bg-brand-plum/20 text-brand-plum dark:text-brand-rose flex items-center justify-center mx-auto mb-2">
                <Smile className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                No comments yet. Be the first to share your thoughts.
              </p>
              <p className="text-xs text-zinc-400">
                Join the discussion with your questions or supportive insights.
              </p>
            </div>
          )}
        </div>

        {/* Comment Input Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shrink-0 space-y-2">
          {/* Replying indicator */}
          {replyingTo && (
            <div className="flex items-center justify-between text-xs px-2.5 py-1 rounded-xl bg-brand-blush/60 dark:bg-brand-plum/20 text-brand-plum dark:text-brand-rose font-medium animate-fadeIn">
              <div className="flex items-center gap-1.5 truncate">
                <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Replying to @{replyingTo.username}</span>
              </div>
              <button
                type="button"
                onClick={handleCancelReply}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 ml-2"
                aria-label="Cancel reply"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Emoji Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="px-2 py-1 rounded-full text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-125 transition-all shrink-0"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment as Rhea Deshmukh..."
              }
              className="flex-1 p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose border border-transparent focus:border-brand-rose/40"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2.5 rounded-2xl bg-brand-rose hover:bg-brand-rose-dark disabled:opacity-40 disabled:hover:bg-brand-rose text-white shadow-soft transition-all shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Send comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </OverlayDrawer>
  );
};
