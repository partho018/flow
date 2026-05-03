import { pgTable, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { users } from "./auth";
export * from "./auth";

export const settings = pgTable("settings", {
  id: text("id").primaryKey(), // Changed from default "default" to be user-specific
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  data: jsonb("data").$type<Record<string, any>>().notNull().default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").unique().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("active"),
  dmsUsed: integer("dms_used").notNull().default(0),
  dmsLimit: integer("dms_limit").notNull().default(100),
  followersCount: integer("followers_count").notNull().default(0),
  joined: text("joined").notNull(),
  rev: integer("rev").notNull().default(0),
  autos: integer("autos").notNull().default(0),
  creditBonus: integer("credit_bonus").notNull().default(0),
  commentsCaught: integer("comments_caught").notNull().default(0),
  igUsername: text("ig_username"),
  igImage: text("ig_image"),
  followsCount: integer("follows_count").notNull().default(0),
  mediaCount: integer("media_count").notNull().default(0),
  accessToken: text("access_token"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const followers = pgTable("followers", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  username: text("username"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull(),
  paymentId: text("payment_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"), 
  userEmail: text("user_email"),
  userName: text("user_name"),
  billedName: text("billed_name"),
  billedPhone: text("billed_phone"),
  billedCountry: text("billed_country"),
  billedState: text("billed_state"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});