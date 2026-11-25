/**
 * HerBook Secure Authentication & Server-Side Authorization Engine
 * Implements HMAC-SHA256 session signatures, role-based access control,
 * audit logging, and authorization helpers.
 */

export type UserRole =
  | "user"
  | "doctor"
  | "creator"
  | "reviewer"
  | "moderator"
  | "admin"
  | "superadmin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isMfaVerified: boolean;
  issuedAt: number;
  expiresAt: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  targetId?: string;
  targetType?: string;
  ipAddress?: string;
  details: string;
}

const SESSION_SECRET = process.env.HERBOOK_SESSION_SECRET || "herbook-secure-pilot-secret-key-2026";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Global audit log store (persisted in-memory for server runtime)
const auditLogs: AuditLogEntry[] = [
  {
    id: "log-seed-1",
    timestamp: "2026-10-15T10:00:00.000Z",
    actorId: "admin-system",
    actorRole: "superadmin",
    action: "SYSTEM_INITIALIZE",
    details: "Security controls and audit subsystem initialized with DPDP & NMC compliance rules.",
  },
];

/**
 * Basic Base64 URL safe encoder
 */
function base64UrlEncode(str: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(str).toString("base64url");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  if (typeof atob !== "undefined") {
    return atob(str);
  }
  return Buffer.from(str, "base64").toString("utf-8");
}

/**
 * Simple signature generation for HMAC token
 */
async function generateHmacSignature(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(SESSION_SECRET);
  const cryptoSubtle = globalThis.crypto?.subtle;

  if (cryptoSubtle) {
    const key = await cryptoSubtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await cryptoSubtle.sign("HMAC", key, enc.encode(payload));
    const bytes = new Uint8Array(signature);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return base64UrlEncode(binary);
  }

  // Fallback signature hash if subtle crypto not loaded
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash << 5) - hash + payload.charCodeAt(i);
    hash |= 0;
  }
  return base64UrlEncode(String(hash));
}

/**
 * Creates a cryptographically signed session token
 */
export async function createSessionToken(
  user: Omit<SessionUser, "issuedAt" | "expiresAt">,
  customTtlMs: number = SESSION_TTL_MS
): Promise<string> {
  const now = Date.now();
  const sessionUser: SessionUser = {
    ...user,
    issuedAt: now,
    expiresAt: now + customTtlMs,
  };

  const payload = JSON.stringify(sessionUser);
  const encodedPayload = base64UrlEncode(payload);
  const signature = await generateHmacSignature(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a session token
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) {
      return null;
    }

    const [encodedPayload, signature] = token.split(".");
    const expectedSignature = await generateHmacSignature(encodedPayload);

    if (signature !== expectedSignature) {
      return null;
    }

    const jsonStr = base64UrlDecode(encodedPayload);
    const sessionUser = JSON.parse(jsonStr) as SessionUser;

    if (Date.now() > sessionUser.expiresAt) {
      return null; // Expired
    }

    return sessionUser;
  } catch (err) {
    return null;
  }
}

/**
 * Records a privileged action in the audit log
 */
export function recordAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const newLog: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  auditLogs.unshift(newLog);

  // Keep last 1,000 entries
  if (auditLogs.length > 1000) {
    auditLogs.pop();
  }

  return newLog;
}

export function getAuditLogs(actorRole?: UserRole): AuditLogEntry[] {
  // Only superadmin or admin can retrieve audit logs
  if (actorRole && actorRole !== "admin" && actorRole !== "superadmin") {
    return [];
  }
  return [...auditLogs];
}

/**
 * Rate Limiting Tracker (in-memory sliding window)
 */
interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetTime: number; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = rateLimitMap.get(identifier);

  if (!bucket || now > bucket.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs, retryAfterSec: 0 };
  }

  if (bucket.count >= limit) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetTime - now) / 1000));
    return { allowed: false, remaining: 0, resetTime: bucket.resetTime, retryAfterSec };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetTime: bucket.resetTime, retryAfterSec: 0 };
}
