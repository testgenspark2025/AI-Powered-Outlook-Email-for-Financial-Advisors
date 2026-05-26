import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const segments = sqliteTable("segments", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  range: text("range").notNull(),
  icon: text("icon"),
  color: text("color"),
  emailTone: text("email_tone").notNull(),
  characteristics: text("characteristics").notNull(),
  challenges: text("challenges").notNull(),
});

export const households = sqliteTable("households", {
  id: text("id").primaryKey(),
  name: text("name"),
  totalMembers: integer("total_members").notNull(),
  householdAssetsCents: integer("household_assets_cents"),
  householdAssetsLabel: text("household_assets_label"),
  createdAt: text("created_at").notNull(),
});

export const householdMembers = sqliteTable(
  "household_members",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .notNull()
      .references(() => households.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    age: integer("age"),
    role: text("role"),
    relation: text("relation"),
    occupation: text("occupation"),
    assetsCents: integer("assets_cents"),
    assetsLabel: text("assets_label"),
  },
  (t) => ({
    byHousehold: index("idx_members_household").on(t.householdId),
  }),
);

export const clients = sqliteTable(
  "clients",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .notNull()
      .references(() => households.id),
    segmentId: integer("segment_id")
      .notNull()
      .references(() => segments.id),
    fullName: text("full_name").notNull(),
    email: text("email").notNull().unique(),
    age: integer("age"),
    occupation: text("occupation"),
    company: text("company"),
    clientSince: text("client_since"),
    riskProfile: text("risk_profile"),
  },
  (t) => ({
    bySegment: index("idx_clients_segment").on(t.segmentId),
  }),
);

export const emails = sqliteTable(
  "emails",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id").references(() => clients.id),
    threadId: text("thread_id"),
    folder: text("folder").notNull(),
    subject: text("subject").notNull(),
    fromEmail: text("from_email").notNull(),
    body: text("body").notNull(),
    preview: text("preview"),
    receivedAt: text("received_at").notNull(),
    isRead: integer("is_read").notNull().default(0),
    isImportant: integer("is_important").notNull().default(0),
    priority: text("priority"),
    needsReply: integer("needs_reply").notNull().default(0),
    sentiment: text("sentiment"),
    marketContext: text("market_context"),
  },
  (t) => ({
    byClient: index("idx_emails_client").on(t.clientId),
    byFolderTime: index("idx_emails_folder_time").on(t.folder, t.receivedAt),
  }),
);

export const summaries = sqliteTable("summaries", {
  id: text("id").primaryKey(),
  emailId: text("email_id")
    .notNull()
    .references(() => emails.id, { onDelete: "cascade" })
    .unique(),
  summary: text("summary").notNull(),
  tokensIn: integer("tokens_in"),
  tokensOut: integer("tokens_out"),
  model: text("model"),
  createdAt: text("created_at").notNull(),
});

export const drafts = sqliteTable(
  "drafts",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id").references(() => clients.id),
    replyToEmailId: text("reply_to_email_id").references(() => emails.id),
    kind: text("kind").notNull(),
    subject: text("subject"),
    body: text("body"),
    depth: text("depth"),
    status: text("status").notNull().default("open"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({
    byStatusUpdated: index("idx_drafts_status_updated").on(t.status, t.updatedAt),
  }),
);

export const sentItems = sqliteTable("sent_items", {
  id: text("id").primaryKey(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id),
  replyToEmailId: text("reply_to_email_id").references(() => emails.id),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  sentAt: text("sent_at").notNull(),
});

export const followUps = sqliteTable(
  "follow_ups",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id),
    sourceDraftId: text("source_draft_id").references(() => drafts.id),
    actionType: text("action_type").notNull(),
    title: text("title").notNull(),
    dueAt: text("due_at"),
    status: text("status").notNull().default("open"),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    byClientStatus: index("idx_followups_client_status").on(t.clientId, t.status),
  }),
);

export const aiCalls = sqliteTable("ai_calls", {
  id: text("id").primaryKey(),
  operation: text("operation").notNull(),
  depth: text("depth"),
  model: text("model").notNull(),
  tokensIn: integer("tokens_in"),
  tokensOut: integer("tokens_out"),
  latencyMs: integer("latency_ms"),
  outcome: text("outcome").notNull(),
  error: text("error"),
  createdAt: text("created_at").notNull(),
  draftId: text("draft_id").references(() => drafts.id),
  emailId: text("email_id").references(() => emails.id),
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  displayName: text("display_name"),
  signature: text("signature"),
  defaultDepth: text("default_depth").default("medium"),
  theme: text("theme").default("system"),
  updatedAt: text("updated_at").notNull(),
});
