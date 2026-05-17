import { useCallback, useEffect, useState, type ReactNode } from 'react';

/* -----------------------------------------------------------------------------
 *  Minimal toast queue + hook. The host app mounts a single <ToastHub> near
 *  the root which subscribes to this store; any component can call
 *  `useToast().push({...})` from anywhere.
 *
 *  Kept dependency-free intentionally — no external state library.
 * --------------------------------------------------------------------------- */

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastDescriptor {
  /** Auto-generated; consumers can pass an explicit id to update an in-flight toast. */
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

type Listener = (toasts: InternalToast[]) => void;

interface ToastStore {
  toasts: InternalToast[];
  listeners: Set<Listener>;
  emit(): void;
  push(t: ToastDescriptor): string;
  dismiss(id: string): void;
  remove(id: string): void;
}

const store: ToastStore = {
  toasts: [],
  listeners: new Set<Listener>(),
  emit() {
    for (const listener of this.listeners) listener(this.toasts);
  },
  push(t: ToastDescriptor) {
    const id = t.id ?? `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const next: InternalToast = { open: true, duration: 5000, variant: 'default', ...t, id };
    this.toasts = [next, ...this.toasts].slice(0, 3);
    this.emit();
    return id;
  },
  dismiss(id: string) {
    this.toasts = this.toasts.map((t: InternalToast) => (t.id === id ? { ...t, open: false } : t));
    this.emit();
  },
  remove(id: string) {
    this.toasts = this.toasts.filter((t: InternalToast) => t.id !== id);
    this.emit();
  },
};

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
  const [toasts, setToasts] = useState<InternalToast[]>(() => [...store.toasts]);

  useEffect(() => {
    const listener: Listener = (next) => setToasts([...next]);
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
    };
  }, []);

  const push = useCallback((t: ToastDescriptor) => store.push(t), []);
  const dismiss = useCallback((id: string) => store.dismiss(id), []);
  const remove = useCallback((id: string) => store.remove(id), []);

  return { toasts, push, dismiss, remove };
}

/** Convenience export — dispatch a toast outside React (e.g. from an API client). */
export const toast = (t: ToastDescriptor) => store.push(t);
