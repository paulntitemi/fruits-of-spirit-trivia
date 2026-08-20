import { buildRound, type RoundId } from "./questions";
import { supabase } from "./supabase";

export interface Room {
  code: string;
  round: RoundId;
  question_ids: string[];
  status: "lobby" | "playing" | "ended";
  created_at: string;
}

export interface Group {
  id: string;
  room_code: string;
  name: string;
  score: number;
  answered: number;
  finished: boolean;
  updated_at: string;
}

// Unambiguous alphabet (no 0/O, 1/I) for codes people read off a screen.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(len = 4): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/** Create a room with a frozen, shared question order every group will play. */
export async function createRoom(round: RoundId): Promise<Room> {
  const question_ids = buildRound(round).map((q) => q.id);
  // Retry on the (rare) code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = makeCode();
    const { data, error } = await supabase
      .from("rooms")
      .insert({ code, round, question_ids, status: "playing" })
      .select()
      .single();
    if (!error && data) return data as Room;
    if (error && error.code !== "23505") throw error; // 23505 = unique_violation
  }
  throw new Error("Could not allocate a room code — please try again.");
}

export async function getRoom(code: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select()
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return (data as Room) ?? null;
}

export async function joinRoom(code: string, name: string): Promise<Group> {
  const { data, error } = await supabase
    .from("groups")
    .insert({ room_code: code.toUpperCase(), name: name.trim() })
    .select()
    .single();
  if (error) throw error;
  return data as Group;
}

export async function getGroup(id: string): Promise<Group | null> {
  const { data, error } = await supabase
    .from("groups")
    .select()
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Group) ?? null;
}

export async function updateGroupScore(
  id: string,
  score: number,
  answered: number,
  finished = false,
): Promise<void> {
  const { error } = await supabase
    .from("groups")
    .update({ score, answered, finished, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function listGroups(code: string): Promise<Group[]> {
  const { data, error } = await supabase
    .from("groups")
    .select()
    .eq("room_code", code.toUpperCase())
    .order("score", { ascending: false });
  if (error) throw error;
  return (data as Group[]) ?? [];
}

// ── Remember which group *this* device is, per room (for refresh-resume) ──
const groupKey = (code: string) => `fos-group-${code.toUpperCase()}`;

export function rememberGroup(code: string, id: string) {
  try {
    window.localStorage.setItem(groupKey(code), id);
  } catch {
    /* ignore */
  }
}

export function recallGroup(code: string): string | null {
  try {
    return window.localStorage.getItem(groupKey(code));
  } catch {
    return null;
  }
}

export function forgetGroup(code: string) {
  try {
    window.localStorage.removeItem(groupKey(code));
  } catch {
    /* ignore */
  }
}
