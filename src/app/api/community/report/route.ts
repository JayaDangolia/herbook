import { NextResponse } from "next/server";
import { recordAuditLog, verifySessionToken } from "@/lib/auth";

export interface ModerationReport {
  id: string;
  reporterId: string;
  contentId: string;
  contentType: "post" | "comment" | "reel" | "message" | "account";
  category:
    | "harassment"
    | "impersonation"
    | "intimate_image_abuse"
    | "medical_misinformation"
    | "unverified_cure_claims"
    | "hate_speech"
    | "spam";
  reason: string;
  status: "pending" | "reviewed_dismissed" | "actioned_removed" | "escalated";
  createdAt: string;
  actionTaken?: string;
  moderatorNotes?: string;
}

export const moderationQueue: ModerationReport[] = [
  {
    id: "rep-101",
    reporterId: "usr-demo-101",
    contentId: "post-demo-3",
    contentType: "post",
    category: "medical_misinformation",
    reason: "Claimed raw papaya juice cures ovarian cysts in 7 days without ultrasound.",
    status: "pending",
    createdAt: "2026-10-15T18:00:00Z",
  },
  {
    id: "rep-102",
    reporterId: "usr-demo-202",
    contentId: "comm-8841",
    contentType: "comment",
    category: "harassment",
    reason: "Abusive body-shaming comment under PCOS discussion thread.",
    status: "pending",
    createdAt: "2026-10-16T01:30:00Z",
  },
];

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    let reporterId = "usr-demo-101";
    let reporterRole: any = "user";

    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        reporterId = session.id;
        reporterRole = session.role;
      }
    }

    const body = await request.json();
    const { contentId, contentType, category, reason } = body;

    if (!contentId || !category) {
      return NextResponse.json(
        { error: "Validation Error", message: "contentId and category are required." },
        { status: 400 }
      );
    }

    const newReport: ModerationReport = {
      id: `rep-${Date.now()}`,
      reporterId,
      contentId,
      contentType: contentType || "post",
      category,
      reason: reason?.trim() || "Flagged by community sister",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    moderationQueue.unshift(newReport);

    recordAuditLog({
      actorId: reporterId,
      actorRole: reporterRole,
      action: "COMMUNITY_CONTENT_REPORTED",
      targetId: contentId,
      targetType: contentType || "post",
      details: `Report filed under category '${category}' by ${reporterId}. Reason: ${newReport.reason}`,
    });

    return NextResponse.json({
      success: true,
      reportId: newReport.id,
      message: "Thank you for keeping HerCircle safe. Our moderation committee will review this report in accordance with the IT Intermediary Rules, 2021.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Error", message: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    count: moderationQueue.length,
    reports: moderationQueue,
  });
}
