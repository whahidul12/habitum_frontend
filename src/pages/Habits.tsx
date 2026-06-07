import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Archive,
  Pencil,
  Trash2,
  Flame,
  Trophy,
  ArchiveRestore,
  Sparkles,
} from "lucide-react";
import api from "@services/api";
import Modal from "@components/ui/Modal";
import HabitForm from "@features/habits/components/HabitForm";
import HabitSuggestionModal from "@features/habits/components/HabitSuggestionModal";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import { CATEGORIES } from "@utils/constants";
import { streakFromKeys } from "@utils/dateHelpers";
import { format, subDays } from "date-fns";
import type { Habit, HabitCreatePayload } from "@features/habits/types/habits.types";
import type { HabitLog } from "@features/habitLogs/types/habitLogs.types";
import type { HabitSuggestion } from "@features/aiInsight/types/aiInsight.types";
import AIChat from "@/features/aiInsight/components/AIChat";

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logsByHabit, setLogsByHabit] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const [showArchived, setShowArchived] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [habitsRes, rangeRes] = await Promise.all([
        api.get<Habit[]>("/habits", { params: { includeArchived: "true" } }),
        api.get<HabitLog[]>("/logs/range", {
          params: {
            start: format(subDays(new Date(), 89), "yyyy-MM-dd"),
            end: format(new Date(), "yyyy-MM-dd"),
          },
        }),
      ]);
      setHabits(habitsRes.data);
      const byId: Record<string, string[]> = {};
      for (const h of habitsRes.data) byId[h._id] = [];
      for (const l of rangeRes.data) {
        if (!byId[l.habitId]) byId[l.habitId] = [];
        byId[l.habitId]!.push(l.completedDate);
      }
      for (const k of Object.keys(byId)) {
        if (byId[k]) byId[k] = byId[k]!.sort().reverse();
      }
      setLogsByHabit(byId);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const [catOpen, setCatOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return habits.filter((h) => {
      if (!showArchived && h.isArchived) return false;
      if (showArchived && !h.isArchived) return false;
      if (category !== "All" && h.category !== category) return false;
      if (q && !h.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [habits, query, category, showArchived]);

  const activeCount = habits.filter((h) => !h.isArchived).length;
  const archivedCount = habits.filter((h) => h.isArchived).length;

  const save = async (data: HabitCreatePayload) => {
    setSubmitting(true);
    try {
      if (editing) {
        const res = await api.put<Habit>(`/habits/${editing._id}`, data);
        setHabits((hs) => hs.map((h) => (h._id === res.data._id ? res.data : h)));
      } else {
        const res = await api.post<Habit>("/habits", data);
        setHabits((hs) => [...hs, res.data]);
        setLogsByHabit((p) => ({ ...p, [res.data._id]: [] }));
      }
      setFormOpen(false);
      setEditing(null);
    } finally {
      setSubmitting(false);
    }
  };

  const archive = async (habit: Habit) => {
    const res = await api.put<Habit>(`/habits/${habit._id}/archive`);
    setHabits((hs) => hs.map((h) => (h._id === res.data._id ? res.data : h)));
  };

  const remove = async (habit: Habit) => {
    await api.delete(`/habits/${habit._id}`);
    setHabits((hs) => hs.filter((h) => h._id !== habit._id));
    setDeleteTarget(null);
  };

  const acceptSuggestion = async (s: HabitSuggestion) => {
    const res = await api.post<Habit>("/habits", {
      name: s.name,
      description: s.description,
      category: s.category,
      frequency: s.frequency,
      icon: s.icon,
      targetDays: s.frequency === "daily" ? 7 : 3,
    });
    setHabits((hs) => [...hs, res.data]);
    setLogsByHabit((p) => ({ ...p, [res.data._id]: [] }));
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl text-center font-semibold tracking-tight">
            All habits
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Manage every habit you've ever created.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" onClick={() => setSuggestOpen(true)}>
            <Sparkles size={14} />
            <span>Suggestion</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={14} />
            New habit
          </button>
        </div>
      </div>

      <div className="card p-4 relative z-20">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none"
            />
            <input
              className="input pl-9"
              placeholder="Search habits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="relative md:w-52">
            <button
              type="button"
              className="input text-left flex items-center justify-between cursor-pointer"
              onClick={() => setCatOpen(!catOpen)}
            >
              <span>{category === "All" ? "All categories" : category}</span>
              <span className="text-xs text-faint">▼</span>
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCatOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl bg-white dark:bg-[rgb(41,38,33)] overflow-hidden shadow-lg py-1 animate-fade-in">
                  <button
                    type="button"
                    className={`w-full text-left px-3.5 py-2.5 text-sm transition hover:bg-(--surface-hover) ${
                      category === "All"
                        ? "text-brand-500 font-medium bg-brand-500/10"
                        : "text-soft"
                    }`}
                    onClick={() => {
                      setCategory("All");
                      setCatOpen(false);
                    }}
                  >
                    All categories
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`w-full text-left px-3.5 py-2.5 text-sm transition hover:bg-(--surface-hover) ${
                        category === c
                          ? "text-brand-500 font-medium bg-brand-500/10"
                          : "text-soft"
                      }`}
                      onClick={() => {
                        setCategory(c);
                        setCatOpen(false);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex justify-between rounded-xl glass overflow-hidden text-sm">
            <button
              onClick={() => setShowArchived(false)}
              className={`px-3.5 py-2.5 font-medium transition w-1/2 md:w-auto ${
                !showArchived
                  ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                  : "text-soft hover:bg-(--surface-hover)"
              }`}
            >
              Active · {activeCount}
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-3.5 py-2.5 font-medium transition border-l divider w-1/2 md:w-auto ${
                showArchived
                  ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                  : "text-soft hover:bg-(--surface-hover)"
              }`}
            >
              Archived · {archivedCount}
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-3">{showArchived ? "🗂️" : "🎯"}</div>
          <div className="font-medium">
            {showArchived
              ? "Nothing archived"
              : habits.length === 0
                ? "No habits yet"
                : "No habits match your filter"}
          </div>
          <div className="text-sm text-muted mt-1">
            {showArchived
              ? "Archived habits keep their history but stay out of your daily list."
              : habits.length === 0
                ? "Start small — something you can do in under 5 minutes."
                : "Try clearing your search or category filter."}
          </div>
          {!showArchived && habits.length === 0 && (
            <button className="btn-primary mt-4" onClick={() => setFormOpen(true)}>
              <Plus size={14} />
              Create habit
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((h) => {
            const keys = logsByHabit[h._id] || [];
            const { current, longest } = streakFromKeys(keys);
            return (
              <div
                key={h._id}
                className={`card p-4 flex items-center gap-4 ${
                  h.isArchived ? "opacity-70" : ""
                }`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${h.color}26`, color: h.color }}
                >
                  {h.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium truncate">{h.name}</div>
                    <span className="chip">{h.category}</span>
                    <span className="chip">{h.frequency}</span>
                    {h.isArchived && (
                      <span className="chip bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        Archived
                      </span>
                    )}
                  </div>
                  {h.description && (
                    <div className="text-sm text-muted truncate mt-0.5">
                      {h.description}
                    </div>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1" title="Current streak">
                    <Flame
                      size={14}
                      className={current > 0 ? "text-orange-500" : "text-faint"}
                    />
                    <span className="font-medium">{current}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Longest streak">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="font-medium">{longest}</span>
                  </div>
                  <div className="text-muted text-xs hidden md:block">
                    {keys.length} total
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    className="btn-ghost p-2"
                    onClick={() => {
                      setEditing(h);
                      setFormOpen(true);
                    }}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn-ghost p-2"
                    onClick={() => archive(h)}
                    title={h.isArchived ? "Unarchive" : "Archive"}
                  >
                    {h.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                  </button>
                  <button
                    className="btn-ghost p-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400"
                    onClick={() => setDeleteTarget(h)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit habit" : "New habit"}
      >
        <HabitForm
          initial={editing}
          submitting={submitting}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={save}
        />
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete habit?"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-soft">
          This will permanently delete <b>{deleteTarget?.name}</b> and all its history.
          This can't be undone.
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white hover:brightness-110 shadow-lg shadow-rose-500/30 transition"
            onClick={() => remove(deleteTarget!)}
          >
            Delete
          </button>
        </div>
      </Modal>

      <HabitSuggestionModal
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        onAccept={acceptSuggestion}
      />
      <AIChat />
    </div>
  );
}
