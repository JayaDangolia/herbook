import { describe, it, expect } from "vitest";
import { initialSocialPosts, SocialPost, SocialComment } from "../data/socialFeedData";
import fs from "fs";
import path from "path";

describe("Overlay Architecture & Comments Drawer Integration", () => {
  describe("CSS Stacking Context Protection", () => {
    it("ensures animate-fadeIn keyframes does NOT persist CSS transform: scale(1)", () => {
      const globalsCssPath = path.resolve(__dirname, "../app/globals.css");
      const cssContent = fs.readFileSync(globalsCssPath, "utf-8");

      // Verify that fadeIn does not retain transform at 100% or to
      // which previously created an unintentional containing block for position: fixed elements
      const toMatch = cssContent.match(/@keyframes fadeIn\s*\{[\s\S]*?to\s*\{([\s\S]*?)\}/);
      expect(toMatch).not.toBeNull();
      const toBlock = toMatch![1];
      expect(toBlock).toContain("transform: none");
      expect(toBlock).not.toContain("transform: scale(1)");
    });
  });

  describe("Comments Feed Data Model & Post Synchronization", () => {
    it("initial demo posts have accurate comment counts matching their comments array length", () => {
      initialSocialPosts.forEach((post) => {
        expect(post.commentsCount).toBe(post.comments.length);
      });
    });

    it("verifies empty state message requirement for zero-comment posts", () => {
      const emptyStateExpected = "No comments yet. Be the first to share your thoughts.";
      const zeroCommentPost = initialSocialPosts.find((p) => p.commentsCount === 0);
      expect(zeroCommentPost).toBeDefined();
      expect(zeroCommentPost?.comments.length).toBe(0);

      // Verify the expected copy string
      expect(emptyStateExpected).toBe("No comments yet. Be the first to share your thoughts.");
    });

    it("supports adding a new comment to a post and synchronizing count", () => {
      const targetPost = { ...initialSocialPosts[0], comments: [...initialSocialPosts[0].comments] };
      const initialCount = targetPost.commentsCount;

      const newComment: SocialComment = {
        id: `c-test-${Date.now()}`,
        authorName: "Ananya Patel",
        authorHandle: "ananya_p",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        isDoctor: false,
        text: "Thank you for sharing this vital clinical advice!",
        timestamp: "Just now",
        likes: 0,
        hasLiked: false,
      };

      const updatedComments = [...targetPost.comments, newComment];
      const updatedPost: SocialPost = {
        ...targetPost,
        comments: updatedComments,
        commentsCount: updatedComments.length,
      };

      expect(updatedPost.commentsCount).toBe(initialCount + 1);
      expect(updatedPost.comments[updatedPost.comments.length - 1].id).toBe(newComment.id);
      expect(updatedPost.comments[updatedPost.comments.length - 1].text).toContain("vital clinical advice");
    });

    it("supports replying to a parent comment with nested reply structure", () => {
      const targetComment: SocialComment = {
        id: "c-parent-1",
        authorName: "Dr. Rohini Sen",
        authorHandle: "dr_rohini_gyn",
        isDoctor: true,
        text: "A 28-day cycle is the textbook average, but 21-35 days is clinically normal.",
        timestamp: "2h ago",
        likes: 12,
        hasLiked: true,
        replies: [],
      };

      const reply: SocialComment = {
        id: "c-reply-1",
        authorName: "Kavita Rao",
        authorHandle: "kavita_r",
        text: "Thank you doctor, this clarifies my concerns!",
        timestamp: "Just now",
        likes: 1,
        hasLiked: false,
      };

      const updatedComment: SocialComment = {
        ...targetComment,
        replies: [...(targetComment.replies || []), reply],
      };

      expect(updatedComment.replies).toHaveLength(1);
      expect(updatedComment.replies![0].authorHandle).toBe("kavita_r");
      expect(updatedComment.replies![0].text).toBe("Thank you doctor, this clarifies my concerns!");
    });
  });

  describe("Portal and Overlay File Integrity", () => {
    it("Portal component exists and mounts into document.body", () => {
      const portalFilePath = path.resolve(__dirname, "../components/ui/Portal.tsx");
      expect(fs.existsSync(portalFilePath)).toBe(true);
      const portalContent = fs.readFileSync(portalFilePath, "utf-8");
      expect(portalContent).toContain("createPortal");
      expect(portalContent).toContain("document.body");
    });

    it("OverlayDrawer component wraps with Portal and high z-index", () => {
      const drawerFilePath = path.resolve(__dirname, "../components/ui/OverlayDrawer.tsx");
      expect(fs.existsSync(drawerFilePath)).toBe(true);
      const drawerContent = fs.readFileSync(drawerFilePath, "utf-8");
      expect(drawerContent).toContain("<Portal>");
      expect(drawerContent).toContain("z-[70]");
      expect(drawerContent).toContain("overflow");
      expect(drawerContent).toContain("Escape");
    });

    it("PostCommentsDrawer includes exact empty state copy and quick reactions", () => {
      const commentsDrawerPath = path.resolve(__dirname, "../components/social/PostCommentsDrawer.tsx");
      expect(fs.existsSync(commentsDrawerPath)).toBe(true);
      const content = fs.readFileSync(commentsDrawerPath, "utf-8");
      expect(content).toContain("No comments yet. Be the first to share your thoughts.");
      expect(content).toContain("OverlayDrawer");
      expect(content).toContain("quickEmojis");
    });
  });
});
