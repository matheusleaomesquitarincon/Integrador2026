import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import * as progressService from "../services/progressService";

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(() => new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCompleted(new Set());
      return;
    }
    let cancelled = false;
    setLoading(true);
    progressService
      .listProgress()
      .then((data) => {
        if (cancelled) return;
        setCompleted(new Set(Array.isArray(data) ? data : []));
      })
      .catch((e) => console.error("Falha ao carregar progresso:", e))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isCompleted = useCallback(
    (slug) => completed.has(slug),
    [completed]
  );

  const mark = useCallback(async (slug) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
    try {
      await progressService.markCompleted(slug);
    } catch (e) {
      console.error("Falha ao marcar como concluído:", e);
      setCompleted((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    }
  }, []);

  const unmark = useCallback(async (slug) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
    try {
      await progressService.unmarkCompleted(slug);
    } catch (e) {
      console.error("Falha ao desmarcar:", e);
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add(slug);
        return next;
      });
    }
  }, []);

  const toggle = useCallback(
    (slug) => {
      if (completed.has(slug)) {
        return unmark(slug);
      }
      return mark(slug);
    },
    [completed, mark, unmark]
  );

  const value = useMemo(
    () => ({ completed, loading, isCompleted, mark, unmark, toggle }),
    [completed, loading, isCompleted, mark, unmark, toggle]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress precisa estar dentro de <ProgressProvider>");
  }
  return ctx;
};
