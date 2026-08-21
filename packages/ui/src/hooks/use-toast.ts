'use client';

import { useCallback, useSyncExternalStore, type ReactNode } from 'react';

/* -----------------------------------------------------------------------------
 *  Minimal toast queue + hook. The host app mounts a single <Toaster> near
 *  the root which subscribes to this store; any component can call
 *  `useToast().push({...})` from anywhere.
 *
 *  Kept dependency-free intentionally — no external state library.
 * --------------------------------------------------------------------------- */

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastDescriptor {
  /** Auto-generated; pass an explicit id to update an in-flight toast in place. */
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. Default 5000. Set to 0 to keep open. */
  duration?: number;
  /** Action button. The alt text is used for screen reader announcements. */
  action?: {
    label: ReactNode;
    altText: string;
    onClick: () => void;
  };
}

interface InternalToast extends ToastDescriptor {
  id: string;
  open: boolean;
}

type Listener = () => void;

/** Max auto-dismissing toasts kept in the queue. Persistent (`duration: 0`) toasts never count. */
const MAX_VISIBLE = 3;

interface ToastStore {
  toasts: InternalToast[];
  listeners: Set<Listener>;
  emit(): void;
  push(t: ToastDescriptor): string;
  dismiss(id: string): void;
  remove(id: string): void;
}

const EMPTY: InternalToast[] = [];

function createStore(): ToastStore {
  return {
    toasts: EMPTY,
    listeners: new Set<Listener>(),
    emit() {
      for (const listener of this.listeners) listener();
    },
    push(t) {
      const id = t.id ?? `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const existing = this.toasts.find((x) => x.id === id);
      let merged: InternalToast[];
      if (existing) {
        // Same id → update in place, keep queue position, re-open if it was closing.
        merged = this.toasts.map((x) => (x.id === id ? { ...x, ...t, id, open: true } : x));
      } else {
        const next: InternalToast = { open: true, duration: 5000, variant: 'default', ...t, id };
        merged = [next, ...this.toasts];
      }
      let kept = 0;
      this.toasts = merged.filter((x) => x.duration === 0 || kept++ < MAX_VISIBLE);
      this.emit();
      return id;
    },
    dismiss(id) {
      this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
      this.emit();
    },
    remove(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.emit();
    },
  };
}

// Created lazily on first use so a server process never holds toasts that
// leak across requests; on the client there is exactly one queue.
let store: ToastStore | null = null;
function getStore(): ToastStore {
  if (!store) store = createStore();
  return store;
}

const subscribe = (listener: Listener) => {
  const s = getStore();
  s.listeners.add(listener);
  return () => {
    s.listeners.delete(listener);
  };
};
const getSnapshot = () => getStore().toasts;
const getServerSnapshot = () => EMPTY;

/**
 * Subscribe to the toast queue and dispatch new toasts.
 *
 * @example
 *   const toast = useToast();
 *   toast.push({ variant: 'success', title: 'Saved' });
 *
 *   // With an action
 *   toast.push({
 *     title: 'Project archived',
 *     action: { label: 'Undo', altText: 'Undo archive', onClick: undo },
 *   });
 */
export function useToast() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const push = useCallback((t: ToastDescriptor) => getStore().push(t), []);
  const dismiss = useCallback((id: string) => getStore().dismiss(id), []);
  const remove = useCallback((id: string) => getStore().remove(id), []);

  return { toasts, push, dismiss, remove };
}

/** Convenience export — dispatch a toast outside React (e.g. from an API client). */
export const toast = (t: ToastDescriptor) => getStore().push(t);
