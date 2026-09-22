import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ConfirmDialog } from '@/components/customer/ui/ConfirmDialog';
import type { ConfirmOptions } from '@/components/customer/ui/ConfirmDialog';

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Themed replacement for `Alert.alert`.
 *
 * Returns a promise rather than taking callbacks, so a guarded action reads top to
 * bottom instead of nesting:
 *
 *   if (!(await confirm({ title: 'Remove item', destructive: true }))) return;
 *   await removeItem(id);
 */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  // Held in a ref, not state: resolving is a side effect of the user's answer and
  // must not participate in rendering.
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>(opts => {
    // A second call while one is open would strand the first promise forever, so
    // settle it as a cancel before taking over.
    resolveRef.current?.(false);
    setOptions(opts);
    return new Promise<boolean>(resolve => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleResolve = useCallback((confirmed: boolean) => {
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  // `confirm` is stable, so callers can safely list it in dependency arrays.
  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {options && <ConfirmDialog visible {...options} onResolve={handleResolve} />}
    </ConfirmContext.Provider>
  );
}
