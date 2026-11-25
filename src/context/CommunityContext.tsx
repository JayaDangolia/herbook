"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CommunityPost, initialCommunityPosts, CommunityComment } from "@/data/communityData";

interface CommunityContextType {
  posts: CommunityPost[];
  createPost: (
    title: string,
    content: string,
    topic: CommunityPost["topic"],
    tags: string[],
    isAnonymous: boolean
  ) => void;
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  addComment: (postId: string, content: string, isAnonymous: boolean) => void;
  reportPost: (postId: string, reason: string) => void;
  reportedPostIds: string[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [reportedPostIds, setReportedPostIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem("herbook_community_posts");
      if (savedPosts) setPosts(JSON.parse(savedPosts));
      const savedReports = localStorage.getItem("herbook_reported_posts");
      if (savedReports) setReportedPostIds(JSON.parse(savedReports));
    } catch {}
  }, []);

  const savePosts = (newPosts: CommunityPost[]) => {
    setPosts(newPosts);
    try {
      localStorage.setItem("herbook_community_posts", JSON.stringify(newPosts));
    } catch {}
  };

  const createPost = (
    title: string,
    content: string,
    topic: CommunityPost["topic"],
    tags: string[],
    isAnonymous: boolean
  ) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: isAnonymous ? "Anonymous Sister" : "Rhea Deshmukh",
      authorHandle: isAnonymous ? "@anonymous_user" : "@rhea_deshmukh",
      authorAvatar: isAnonymous
        ? ""
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isAnonymous,
      topic,
      title,
      content,
      tags,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      createdAt: "Just now",
      comments: [],
    };
    savePosts([newPost, ...posts]);
  };

  const likePost = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const savePost = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextSaved = !p.hasSaved;
        return {
          ...p,
          hasSaved: nextSaved,
          savesCount: nextSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1),
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const addComment = (postId: string, content: string, isAnonymous: boolean) => {
    const newComment: CommunityComment = {
      id: `comm-${Date.now()}`,
      authorName: isAnonymous ? "Anonymous Sister" : "Rhea Deshmukh",
      authorAvatar: isAnonymous
        ? ""
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      isAnonymous,
      content,
      createdAt: "Just now",
      likesCount: 0,
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [newComment, ...p.comments],
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const reportPost = (postId: string, reason: string) => {
    const nextReported = [...reportedPostIds, postId];
    setReportedPostIds(nextReported);
    try {
      localStorage.setItem("herbook_reported_posts", JSON.stringify(nextReported));
    } catch {}

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, isReported: true };
      }
      return p;
    });
    savePosts(updated);
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        createPost,
        likePost,
        savePost,
        addComment,
        reportPost,
        reportedPostIds,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};
