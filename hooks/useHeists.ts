"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import db from "@/lib/db";
import { COLLECTIONS, heistConverter } from "@/types/firestore";
import type { Heist } from "@/types/firestore";
import { useUser } from "@/hooks/useUser";

export type HeistMode = "active" | "assigned-by-me" | "expired";

export function useHeists(mode: HeistMode): {
  heists: Heist[];
  loading: boolean;
} {
  const { uid } = useUser();
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mode !== "expired" && !uid) return;

    const ref = collection(db, COLLECTIONS.HEISTS).withConverter(
      heistConverter,
    );
    const now = Timestamp.now();

    const q =
      mode === "active"
        ? query(
            ref,
            where("assignedTo", "==", uid),
            where("deadline", ">", now),
          )
        : mode === "assigned-by-me"
          ? query(
              ref,
              where("createdBy", "==", uid),
              where("deadline", ">", now),
            )
          : query(ref, where("deadline", "<", now));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs: Heist[] = snapshot.docs.map((doc) => doc.data() as Heist);
      if (mode === "expired") {
        docs = docs.filter((h) => h.finalStatus !== null);
      }
      setHeists(docs);
      setLoading(false);
    });

    return unsubscribe;
  }, [mode, uid]);

  return { heists, loading };
}
