"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Send,
  X,
  ExternalLink,
} from "lucide-react";
import { Reel } from "@/data/reelsData";
import { useApp } from "@/context/AppContext";

interface ReelViewerProps {
  reels: Reel[];
  onUploadClick: () => void;
}

export const ReelViewer: React.FC<ReelViewerProps> = ({ reels, onUploadClick }) => {
  const { showNotification } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCommentsReel, setActiveCommentsReel] = useState<Reel | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [reelList, setReelList] = useState<Reel[]>(reels);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentReel = reelList[currentIndex] || reelList[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY < -45) {
      handleNext();
    } else if (deltaY > 45) {
      handlePrev();
    }
    touchStartY.current = null;
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleNext = () => {
    if (currentIndex < reelList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReelList((prev) =>
      prev.map((r, i) => {
        if (i === currentIndex) {
          const nextLiked = !r.hasLiked;
          return {
            ...r,
            hasLiked: nextLiked,
            likesCount: nextLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReelList((prev) =>
      prev.map((r, i) => {
        if (i === currentIndex) {
          const nextSaved = !r.hasSaved;
          return { ...r, hasSaved: nextSaved };
        }
        return r;
      })
    );
    showNotification("Saved to your health learning collection!");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: currentReel.title,
        text: currentReel.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification("Reel link copied to clipboard!");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsReel) return;

    const newComment = {
      id: `rc-${Date.now()}`,
      author: "Rhea Deshmukh",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      text: newCommentText.trim(),
      timestamp: "Just now",
      likes: 0,
    };

    setReelList((prev) =>
      prev.map((r) => {
        if (r.id === activeCommentsReel.id) {
          return {
            ...r,
            commentsCount: r.commentsCount + 1,
            comments: [newComment, ...r.comments],
          };
        }
        return r;
      })
    );

    setActiveCommentsReel((prev) =>
      prev ? { ...prev, comments: [newComment, ...prev.comments], commentsCount: prev.commentsCount + 1 } : null
    );

    setNewCommentText("");
  };

  const getLabelBadge = (label: Reel["label"]) => {
    switch (label) {
      case "Clinician Reviewed":
        return "bg-emerald-500/90 text-white border-emerald-400";
      case "Personal Experience":
        return "bg-purple-500/90 text-white border-purple-400";
      case "General Wellness":
        return "bg-blue-500/90 text-white border-blue-400";
      case "Sponsored":
        return "bg-amber-500/90 text-white border-amber-400";
    }
  };

  return (
    <div className="relative max-w-sm sm:max-w-md mx-auto h-[78vh] sm:h-[82vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 select-none flex flex-col justify-between">
      {/* Video / Player Container with Swipe Detection */}
      <div
        className="absolute inset-0 z-0 cursor-pointer"
        onClick={togglePlay}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          poster={currentReel.posterUrl}
          playsInline
          loop
          autoPlay
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Gradient dark overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

        {/* Play/Pause indicator icon on tap */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Top Bar: Verification Label & Mute Button */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md flex items-center gap-1 ${getLabelBadge(currentReel.label)}`}>
            {currentReel.label === "Clinician Reviewed" && <ShieldCheck className="w-3 h-3" />}
            <span>{currentReel.label}</span>
          </span>
          <span className="text-[10px] text-zinc-300 font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md">
            {currentReel.category}
          </span>
        </div>

        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Vertical Navigation Controls (Up/Down) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 flex flex-col space-y-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={currentIndex === 0}
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors disabled:opacity-20 border border-white/20"
          aria-label="Previous Reel"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          disabled={currentIndex === reelList.length - 1}
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors disabled:opacity-20 border border-white/20"
          aria-label="Next Reel"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Right Action Rail: Like, Comment, Bookmark, Share */}
      <div className="relative z-10 self-end mr-4 mb-24 flex flex-col items-center space-y-4">
        {/* Like */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center group"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart
              className={`w-5 h-5 ${
                currentReel.hasLiked ? "text-brand-rose fill-brand-rose" : "text-white"
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
            {currentReel.likesCount}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveCommentsReel(currentReel);
          }}
          className="flex flex-col items-center group"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
            {currentReel.commentsCount}
          </span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleSave}
          className="flex flex-col items-center group"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bookmark
              className={`w-5 h-5 ${
                currentReel.hasSaved ? "text-amber-400 fill-amber-400" : "text-white"
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
            Save
          </span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center group"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
            Share
          </span>
        </button>
      </div>

      {/* Bottom Info: Creator, Title, Caption & Linked Actions */}
      <div className="relative z-10 p-5 space-y-2.5">
        {/* Creator Info */}
        <div className="flex items-center space-x-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentReel.creatorAvatar}
            alt={currentReel.creatorName}
            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white drop-shadow-md">
                {currentReel.creatorName}
              </span>
              {currentReel.isCreatorVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              )}
            </div>
            <span className="text-[10px] text-zinc-300 drop-shadow-md">
              {currentReel.creatorHandle}
            </span>
          </div>
        </div>

        {/* Title & Caption */}
        <div>
          <h4 className="text-sm font-bold text-white drop-shadow-md line-clamp-1">
            {currentReel.title}
          </h4>
          <p className="text-xs text-zinc-200 drop-shadow-md line-clamp-2 mt-0.5 leading-snug">
            {currentReel.caption}
          </p>
        </div>

        {/* Linked Health Action (Reels to Consultations / Trackers) */}
        {currentReel.linkedAction && (
          <div className="pt-1">
            <Link
              href={
                currentReel.linkedAction.type === "consult"
                  ? `/consult/${currentReel.linkedAction.targetId || ""}`
                  : currentReel.linkedAction.type === "track"
                  ? "/track"
                  : "/pcos"
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-rose/90 hover:bg-brand-rose text-white text-xs font-bold backdrop-blur-md shadow-soft transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentReel.linkedAction.label}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Comments Drawer Modal */}
      {activeCommentsReel && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-t-3xl p-5 max-h-[70%] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-brand-rose" />
                Comments ({activeCommentsReel.commentsCount})
              </h4>
              <button
                onClick={() => setActiveCommentsReel(null)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {activeCommentsReel.comments.map((comm) => (
                <div key={comm.id} className="flex items-start space-x-2.5 text-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={comm.avatar}
                    alt={comm.author}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 p-2.5 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {comm.author}
                      </span>
                      <span className="text-[10px] text-zinc-400">{comm.timestamp}</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-1">{comm.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment form */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share supportive advice..."
                className="flex-1 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-brand-rose text-white hover:bg-brand-rose-dark transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
