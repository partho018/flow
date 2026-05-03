import { db, settings as settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

type AutomationConfig = {
  enabled?: boolean;
  keyword?: string;
  dmOn?: string;
};

export type SettingsStore = {
  [mediaId: string]: AutomationConfig;
};

export async function getSettings(userId: string): Promise<SettingsStore> {
  const query = userId === "SYSTEM_GLOBAL" 
    ? eq(settingsTable.id, "user_SYSTEM_GLOBAL")
    : eq(settingsTable.userId, userId);

  const [record] = await db
    .select()
    .from(settingsTable)
    .where(query);
  
  return (record?.data as SettingsStore) || {};
}

export async function setSettings(userId: string, settings: SettingsStore): Promise<void> {
  try {
    // Attempt with userId (normal flow)
    await db
      .insert(settingsTable)
      .values({
        id: `user_${userId}`,
        userId: userId,
        data: settings,
      })
      .onConflictDoUpdate({
        target: settingsTable.id,
        set: { 
          data: settings,
          updatedAt: new Date()
        },
      });
  } catch (error) {
    // Fallback: Attempt without userId (for hardcoded accounts like 'admin')
    console.warn("Setting save failed with userId, attempting fallback to null userId", error);
    await db
      .insert(settingsTable)
      .values({
        id: `user_${userId}`,
        userId: null,
        data: settings,
      })
      .onConflictDoUpdate({
        target: settingsTable.id,
        set: { 
          data: settings,
          updatedAt: new Date()
        },
      });
  }
}

