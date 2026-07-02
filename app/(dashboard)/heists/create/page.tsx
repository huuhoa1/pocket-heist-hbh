"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import db from "@/lib/db";
import { COLLECTIONS } from "@/types/firestore";
import type { CreateHeistInput } from "@/types/firestore";
import { useUser } from "@/hooks/useUser";
import styles from "./create-heist.module.css";

interface UserOption {
  id: string;
  codename: string;
}

export default function CreateHeistPage() {
  const router = useRouter();
  const { uid, displayName } = useUser();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      setUsers(snapshot.docs.map((doc) => doc.data() as UserOption));
      setIsLoadingUsers(false);
    }
    loadUsers();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assignedTo = formData.get("assignedTo") as string;
    const assignee = users.find((u) => u.id === assignedTo);

    const input: CreateHeistInput = {
      createdAt: serverTimestamp(),
      title,
      description,
      createdBy: uid!,
      createdByCodename: displayName ?? uid!,
      assignedTo,
      assignedToCodename: assignee?.codename ?? assignedTo,
      deadline: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)),
      finalStatus: null,
    };

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, COLLECTIONS.HEISTS), input);
      router.push("/heists");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="center-content">
      <div className={styles.formWrapper}>
        <h2 className="form-title">Create a New Heist</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Mission Title</span>
            <input type="text" name="title" required disabled={isSubmitting} />
          </label>

          <label className={styles.field}>
            <span>Briefing</span>
            <textarea
              name="description"
              required
              disabled={isSubmitting}
              rows={4}
            />
          </label>

          <label className={styles.field}>
            <span>Assign Target</span>
            <select
              name="assignedTo"
              required
              disabled={isSubmitting || isLoadingUsers}
            >
              {isLoadingUsers ? (
                <option value="">Loading targets…</option>
              ) : users.length === 0 ? (
                <option value="">No targets found</option>
              ) : (
                users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.codename}
                  </option>
                ))
              )}
            </select>
          </label>

          <button
            type="submit"
            className="btn"
            disabled={isSubmitting || isLoadingUsers || users.length === 0}
          >
            {isSubmitting ? "Planning…" : "Launch Heist"}
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
