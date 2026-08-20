"use client";

import { useEffect, useState } from "react";
import { type Group, listGroups } from "./rooms";
import { supabase } from "./supabase";

const byScore = (a: Group, b: Group) =>
  b.score - a.score ||
  b.answered - a.answered ||
  a.updated_at.localeCompare(b.updated_at); // earlier finisher wins ties

/**
 * Live, score-sorted groups for a room. Seeds from a one-shot fetch, then keeps
 * itself current via a Supabase realtime subscription on the `groups` table.
 */
export function useLeaderboard(code: string | null): Group[] {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!code) return;
    let active = true;

    listGroups(code).then((rows) => {
      if (active) setGroups([...rows].sort(byScore));
    });

    const channel = supabase
      .channel(`room:${code}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "groups",
          filter: `room_code=eq.${code.toUpperCase()}`,
        },
        (payload) => {
          setGroups((prev) => {
            const next = new Map(prev.map((g) => [g.id, g]));
            if (payload.eventType === "DELETE") {
              next.delete((payload.old as Group).id);
            } else {
              const row = payload.new as Group;
              next.set(row.id, row);
            }
            return [...next.values()].sort(byScore);
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [code]);

  return groups;
}
