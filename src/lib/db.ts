import fs from "fs";
import path from "path";
import crypto from "crypto";
import { UserRole } from "./auth";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  status: "active" | "suspended" | "pending_verification";
  isEmailVerified: boolean;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface CyclePeriodRecord {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  flow: "spotting" | "light" | "medium" | "heavy";
  symptoms: string[];
  notes?: string;
  createdAt: string;
}

export interface CycleDailyLogRecord {
  id: string;
  userId: string;
  date: string;
  isPeriod: boolean;
  flow?: string;
  symptoms: string[];
  mood?: string;
  energy?: string;
  notes?: string;
  createdAt: string;
}

export interface HealthRecordItem {
  id: string;
  userId: string;
  title: string;
  type: "Lab Report" | "Ultrasound Scan" | "Prescription" | "Clinical Note";
  date: string;
  fileUrl: string;
  fileSize: string;
  sharedWithDoctorIds: string[];
  notes?: string;
  createdAt: string;
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  doctorSpecialty: string;
  medicalSystem: string;
  date: string;
  time: string;
  mode: "video" | "in-person";
  doctorFee: number;
  platformFee: number;
  totalPaid: number;
  paymentStatus: "paid_sandbox" | "paid_live" | "refunded";
  status: "upcoming" | "completed" | "cancelled";
  meetingRoomId: string;
  patientName: string;
  patientNotes?: string;
  consultationNotes?: string;
  doctorPrescription?: string;
  sharedRecordIds: string[];
  createdAt: string;
}

export interface DoctorApplicationRecord {
  id: string;
  userId?: string;
  legalName: string;
  email: string;
  phone: string;
  gender: string;
  medicalSystem: string;
  registeringCouncil: string;
  registrationNumber: string;
  registrationYear: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  clinicLocation: string;
  languages: string[];
  certificateFileName: string;
  identityFileName: string;
  status: "Under Review" | "Verified" | "Rejected" | "More Information Required";
  submittedAt: string;
  verificationSource?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface PostRecord {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isVerified: boolean;
  caption: string;
  mediaType: "image" | "carousel" | "video";
  mediaUrls: string[];
  category: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface PostCommentRecord {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  likes: number;
  createdAt: string;
}

export interface AuditLogRecord {
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

interface DatabaseSchema {
  users: UserAccount[];
  periods: CyclePeriodRecord[];
  dailyLogs: CycleDailyLogRecord[];
  healthRecords: HealthRecordItem[];
  appointments: AppointmentRecord[];
  doctorApplications: DoctorApplicationRecord[];
  posts: PostRecord[];
  comments: PostCommentRecord[];
  postLikes: { userId: string; postId: string }[];
  savedPosts: { userId: string; postId: string }[];
  follows: { followerId: string; followingId: string }[];
  auditLogs: AuditLogRecord[];
}

// Data directory resolution: works locally and in serverless environments (e.g. /tmp on Vercel)
const DB_DIR = process.env.VERCEL ? "/tmp" : path.resolve(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "herbook-db.json");

// Password hashing utilities using PBKDF2 with 10,000 iterations
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 10000, 64, "sha512").toString("hex");
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const result = hashPassword(password, salt);
  return result.hash === hash;
}

// Seed admin & initial demo account
function getInitialSeedData(): DatabaseSchema {
  const adminCreds = hashPassword("Admin@HerBook2026", "herbook-admin-salt");
  const rheaCreds = hashPassword("Rhea@HerBook2026", "herbook-rhea-salt");

  return {
    users: [
      {
        id: "usr-admin-001",
        name: "HerBook SuperAdmin",
        username: "admin",
        email: "admin@herbook.in",
        passwordHash: adminCreds.hash,
        salt: adminCreds.salt,
        role: "admin",
        status: "active",
        isEmailVerified: true,
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
        bio: "HerBook Clinical Governance, Security & Regulatory Administrator",
        createdAt: "2026-10-01T00:00:00.000Z",
        updatedAt: "2026-10-01T00:00:00.000Z",
      },
      {
        id: "usr-demo-rhea",
        name: "Rhea Deshmukh (Demo)",
        username: "rhea_d",
        email: "rhea@example.com",
        passwordHash: rheaCreds.hash,
        salt: rheaCreds.salt,
        role: "user",
        status: "active",
        isEmailVerified: true,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        bio: "Passionate about women's wellness, PCOS advocacy & mindful living 🌸 Mumbai, India",
        createdAt: "2026-10-15T00:00:00.000Z",
        updatedAt: "2026-10-15T00:00:00.000Z",
      },
    ],
    periods: [
      {
        id: "per-demo-1",
        userId: "usr-demo-rhea",
        startDate: "2026-09-18",
        endDate: "2026-09-22",
        flow: "medium",
        symptoms: ["Cramps", "Fatigue"],
        notes: "Hydrated with warm ginger tea.",
        createdAt: "2026-09-18T08:00:00.000Z",
      },
      {
        id: "per-demo-2",
        userId: "usr-demo-rhea",
        startDate: "2026-08-21",
        endDate: "2026-08-25",
        flow: "heavy",
        symptoms: ["Bloating", "Headache"],
        notes: "Mild lower back discomfort.",
        createdAt: "2026-08-21T08:00:00.000Z",
      },
    ],
    dailyLogs: [],
    healthRecords: [
      {
        id: "rec-demo-1",
        userId: "usr-demo-rhea",
        title: "Pelvic Ultrasound Report - Bilateral Ovaries",
        type: "Ultrasound Scan",
        date: "2026-09-28",
        fileUrl: "/api/records/rec-1/file",
        fileSize: "2.4 MB (PDF)",
        sharedWithDoctorIds: ["doc-allo-1"],
        notes: "Normal endometrial thickness. 8-10 peripheral follicles noted.",
        createdAt: "2026-09-28T10:00:00.000Z",
      },
    ],
    appointments: [],
    doctorApplications: [
      {
        id: "doc-app-1",
        legalName: "Dr. Ananya Sharma",
        email: "dr.ananya@hercare.in",
        phone: "+91 98201 55432",
        gender: "Female",
        medicalSystem: "Allopathy",
        registeringCouncil: "Maharashtra Medical Council",
        registrationNumber: "MMC-2015-88492",
        registrationYear: "2015",
        qualification: "MBBS, MS (OB-GYN)",
        specialty: "Gynecology & Reproductive Endocrinology",
        experienceYears: 11,
        clinicLocation: "Bandra West, Mumbai",
        languages: ["English", "Hindi", "Marathi"],
        certificateFileName: "mmc_registration_sharma.pdf",
        identityFileName: "aadhaar_verified_sharma.pdf",
        status: "Verified",
        submittedAt: "2026-10-14T09:30:00Z",
        verificationSource: "NMC National Medical Register (IMR-2015-88492)",
        reviewedBy: "Admin Compliance Committee",
        reviewedAt: "2026-10-15T11:00:00Z",
        reviewNotes: "Primary medical degree and post-graduate degree verified on MMC public search portal.",
      },
      {
        id: "doc-app-2",
        legalName: "Dr. Priyamvada Joshi",
        email: "dr.priyamvada@ayurvedaher.in",
        phone: "+91 98450 11223",
        gender: "Female",
        medicalSystem: "Ayurveda",
        registeringCouncil: "Karnataka Ayurvedic & Unani Practitioners Board",
        registrationNumber: "KAUPB-AYUR-2018-4412",
        registrationYear: "2018",
        qualification: "BAMS, MD (Ayurveda - Prasuti & Stri Roga)",
        specialty: "Ayurvedic Gynecology & Stree Rog",
        experienceYears: 8,
        clinicLocation: "Indiranagar, Bengaluru",
        languages: ["English", "Hindi", "Kannada"],
        certificateFileName: "kaupb_cert_joshi.pdf",
        identityFileName: "passport_verified_joshi.pdf",
        status: "Under Review",
        submittedAt: "2026-10-15T14:15:00Z",
      },
    ],
    posts: [
      {
        id: "post-seed-1",
        authorId: "usr-admin-001",
        authorName: "Dr. Ananya Sharma",
        authorHandle: "dr_ananya_gyn",
        authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
        isVerified: true,
        caption: "Understanding PCOS vs PCOD: They are clinically distinct conditions. PCOD is manageable through sustained lifestyle changes, while PCOS requires thorough endocrine evaluation. Always consult a certified RMP.",
        mediaType: "image",
        mediaUrls: ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"],
        category: "PCOS & Hormonal Health",
        likesCount: 1420,
        commentsCount: 2,
        createdAt: "2026-10-15T09:00:00.000Z",
      },
    ],
    comments: [
      {
        id: "comm-seed-1",
        postId: "post-seed-1",
        authorId: "usr-demo-rhea",
        authorName: "Rhea Deshmukh",
        authorHandle: "rhea_d",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        text: "This explanation is so reassuring doctor! Thank you for clarifying.",
        likes: 14,
        createdAt: "2026-10-15T10:00:00.000Z",
      },
    ],
    postLikes: [],
    savedPosts: [],
    follows: [],
    auditLogs: [
      {
        id: "audit-seed-1",
        timestamp: "2026-10-15T00:00:00.000Z",
        actorId: "system",
        actorRole: "superadmin",
        action: "DATABASE_INITIALIZE",
        details: "Production database initialized with DPDP & NMC regulatory schema.",
      },
    ],
  };
}

// In-memory cache for ultra-fast response with file persistence
let inMemoryDb: DatabaseSchema | null = null;

function loadDatabase(): DatabaseSchema {
  if (inMemoryDb) return inMemoryDb;

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      inMemoryDb = JSON.parse(data);
      return inMemoryDb!;
    }
  } catch (err) {
    console.error("Warning reading persistent database file, seeding fallback:", err);
  }

  inMemoryDb = getInitialSeedData();
  saveDatabase(inMemoryDb);
  return inMemoryDb;
}

function saveDatabase(db: DatabaseSchema) {
  inMemoryDb = db;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Warning writing database file:", err);
  }
}

// ==========================================
// PUBLIC DATABASE API METHODS
// ==========================================

export const db = {
  // USER OPERATIONS
  users: {
    findMany: async (): Promise<UserAccount[]> => {
      const db = loadDatabase();
      return db.users;
    },
    findById: async (id: string): Promise<UserAccount | null> => {
      const db = loadDatabase();
      return db.users.find((u) => u.id === id) || null;
    },
    findByEmail: async (email: string): Promise<UserAccount | null> => {
      const db = loadDatabase();
      const normalized = email.toLowerCase().trim();
      return db.users.find((u) => u.email.toLowerCase().trim() === normalized) || null;
    },
    findByUsername: async (username: string): Promise<UserAccount | null> => {
      const db = loadDatabase();
      const normalized = username.toLowerCase().trim();
      return db.users.find((u) => u.username.toLowerCase().trim() === normalized) || null;
    },
    create: async (data: Omit<UserAccount, "id" | "createdAt" | "updatedAt">): Promise<UserAccount> => {
      const db = loadDatabase();
      const newUser: UserAccount = {
        ...data,
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.users.push(newUser);
      saveDatabase(db);
      return newUser;
    },
    update: async (id: string, updates: Partial<UserAccount>): Promise<UserAccount | null> => {
      const db = loadDatabase();
      const idx = db.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;

      db.users[idx] = {
        ...db.users[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      return db.users[idx];
    },
  },

  // MENSTRUAL CYCLE RECORDS
  periods: {
    findByUserId: async (userId: string): Promise<CyclePeriodRecord[]> => {
      const db = loadDatabase();
      return db.periods.filter((p) => p.userId === userId).sort((a, b) => b.startDate.localeCompare(a.startDate));
    },
    create: async (period: Omit<CyclePeriodRecord, "id" | "createdAt">): Promise<CyclePeriodRecord> => {
      const db = loadDatabase();
      const newPeriod: CyclePeriodRecord = {
        ...period,
        id: `per-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      db.periods.push(newPeriod);
      saveDatabase(db);
      return newPeriod;
    },
    delete: async (id: string, userId: string): Promise<boolean> => {
      const db = loadDatabase();
      const initialLength = db.periods.length;
      db.periods = db.periods.filter((p) => !(p.id === id && p.userId === userId));
      saveDatabase(db);
      return db.periods.length < initialLength;
    },
    clearAllForUser: async (userId: string): Promise<number> => {
      const db = loadDatabase();
      const before = db.periods.length;
      db.periods = db.periods.filter((p) => p.userId !== userId);
      saveDatabase(db);
      return before - db.periods.length;
    },
  },

  // HEALTH RECORDS VAULT
  healthRecords: {
    findByUserId: async (userId: string): Promise<HealthRecordItem[]> => {
      const db = loadDatabase();
      return db.healthRecords.filter((r) => r.userId === userId).sort((a, b) => b.date.localeCompare(a.date));
    },
    create: async (record: Omit<HealthRecordItem, "id" | "createdAt">): Promise<HealthRecordItem> => {
      const db = loadDatabase();
      const newRec: HealthRecordItem = {
        ...record,
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      db.healthRecords.push(newRec);
      saveDatabase(db);
      return newRec;
    },
    delete: async (id: string, userId: string): Promise<boolean> => {
      const db = loadDatabase();
      const initialLength = db.healthRecords.length;
      db.healthRecords = db.healthRecords.filter((r) => !(r.id === id && r.userId === userId));
      saveDatabase(db);
      return db.healthRecords.length < initialLength;
    },
    toggleDoctorSharing: async (id: string, userId: string, doctorId: string): Promise<HealthRecordItem | null> => {
      const db = loadDatabase();
      const rec = db.healthRecords.find((r) => r.id === id && r.userId === userId);
      if (!rec) return null;

      if (rec.sharedWithDoctorIds.includes(doctorId)) {
        rec.sharedWithDoctorIds = rec.sharedWithDoctorIds.filter((d) => d !== doctorId);
      } else {
        rec.sharedWithDoctorIds.push(doctorId);
      }
      saveDatabase(db);
      return rec;
    },
  },

  // DOCTOR ONBOARDING APPLICATIONS
  doctorApplications: {
    findAll: async (): Promise<DoctorApplicationRecord[]> => {
      const db = loadDatabase();
      return db.doctorApplications;
    },
    create: async (app: Omit<DoctorApplicationRecord, "id" | "submittedAt" | "status">): Promise<DoctorApplicationRecord> => {
      const db = loadDatabase();
      const newApp: DoctorApplicationRecord = {
        ...app,
        id: `doc-app-${Date.now()}`,
        status: "Under Review",
        submittedAt: new Date().toISOString(),
      };
      db.doctorApplications.push(newApp);
      saveDatabase(db);
      return newApp;
    },
    updateStatus: async (
      id: string,
      status: DoctorApplicationRecord["status"],
      verificationSource?: string,
      reviewedBy?: string,
      reviewNotes?: string
    ): Promise<DoctorApplicationRecord | null> => {
      const db = loadDatabase();
      const app = db.doctorApplications.find((a) => a.id === id);
      if (!app) return null;

      app.status = status;
      if (verificationSource) app.verificationSource = verificationSource;
      if (reviewedBy) app.reviewedBy = reviewedBy;
      if (reviewNotes) app.reviewNotes = reviewNotes;
      app.reviewedAt = new Date().toISOString();

      saveDatabase(db);
      return app;
    },
  },

  // POSTS & USER CONTENT
  posts: {
    findAll: async (): Promise<PostRecord[]> => {
      const db = loadDatabase();
      return db.posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    findByAuthorId: async (authorId: string): Promise<PostRecord[]> => {
      const db = loadDatabase();
      return db.posts.filter((p) => p.authorId === authorId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    findById: async (id: string): Promise<PostRecord | null> => {
      const db = loadDatabase();
      return db.posts.find((p) => p.id === id) || null;
    },
    create: async (data: Omit<PostRecord, "id" | "likesCount" | "commentsCount" | "createdAt">): Promise<PostRecord> => {
      const db = loadDatabase();
      const newPost: PostRecord = {
        ...data,
        id: `post-${Date.now()}`,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
      };
      db.posts.unshift(newPost);
      saveDatabase(db);
      return newPost;
    },
    incrementCommentCount: async (postId: string) => {
      const db = loadDatabase();
      const post = db.posts.find((p) => p.id === postId);
      if (post) {
        post.commentsCount += 1;
        saveDatabase(db);
      }
    },
  },

  // AUDIT LOGS
  auditLogs: {
    findAll: async (): Promise<AuditLogRecord[]> => {
      const db = loadDatabase();
      return db.auditLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    },
    create: async (entry: Omit<AuditLogRecord, "id" | "timestamp">): Promise<AuditLogRecord> => {
      const db = loadDatabase();
      const log: AuditLogRecord = {
        ...entry,
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
      };
      db.auditLogs.unshift(log);
      saveDatabase(db);
      return log;
    },
  },
};
