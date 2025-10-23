import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  events, InsertEvent,
  rsvps, InsertRsvp,
  venues, InsertVenue,
  members, InsertMember,
  albums, InsertAlbum,
  photos, InsertPhoto
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// EVENT OPERATIONS
// ============================================================================

export async function createEvent(event: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(events).values(event);
  return event;
}

export async function getUserEvents(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(events).where(eq(events.userId, userId)).orderBy(desc(events.createdAt));
}

export async function getEvent(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateEvent(id: string, updates: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(events).set(updates).where(eq(events.id, id));
}

export async function deleteEvent(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(events).where(eq(events.id, id));
}

// ============================================================================
// RSVP OPERATIONS
// ============================================================================

export async function createRsvp(rsvp: InsertRsvp) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(rsvps).values(rsvp);
  return rsvp;
}

export async function getEventRsvps(eventId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(rsvps).where(eq(rsvps.eventId, eventId)).orderBy(desc(rsvps.createdAt));
}

export async function updateRsvp(id: string, updates: Partial<InsertRsvp>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(rsvps).set(updates).where(eq(rsvps.id, id));
}

// ============================================================================
// VENUE OPERATIONS
// ============================================================================

export async function createVenue(venue: InsertVenue) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(venues).values(venue);
  return venue;
}

export async function getUserVenues(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(venues).where(eq(venues.userId, userId)).orderBy(desc(venues.createdAt));
}

export async function getVenue(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(venues).where(eq(venues.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateVenue(id: string, updates: Partial<InsertVenue>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(venues).set(updates).where(eq(venues.id, id));
}

export async function deleteVenue(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(venues).where(eq(venues.id, id));
}

// ============================================================================
// MEMBER OPERATIONS
// ============================================================================

export async function createMember(member: InsertMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(members).values(member);
  return member;
}

export async function getUserMembers(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(members).where(eq(members.userId, userId)).orderBy(desc(members.createdAt));
}

export async function getMember(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateMember(id: string, updates: Partial<InsertMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(members).set(updates).where(eq(members.id, id));
}

export async function deleteMember(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(members).where(eq(members.id, id));
}

// ============================================================================
// ALBUM OPERATIONS
// ============================================================================

export async function createAlbum(album: InsertAlbum) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(albums).values(album);
  return album;
}

export async function getUserAlbums(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(albums).where(eq(albums.userId, userId)).orderBy(desc(albums.createdAt));
}

export async function getAlbum(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(albums).where(eq(albums.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// PHOTO OPERATIONS
// ============================================================================

export async function createPhoto(photo: InsertPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(photos).values(photo);
  return photo;
}

export async function getAlbumPhotos(albumId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(photos).where(eq(photos.albumId, albumId)).orderBy(desc(photos.createdAt));
}

export async function getUserPhotos(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(photos).where(eq(photos.userId, userId)).orderBy(desc(photos.createdAt));
}

