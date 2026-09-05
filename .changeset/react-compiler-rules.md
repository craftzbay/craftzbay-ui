---
'@craftzbay/ui': patch
---

The library passes eslint-plugin-react-hooks 7 (React Compiler rules) with two
documented exceptions. Behaviour changes are limited to timing details:

- `useDebounce` with `delay <= 0` returns the input value directly instead of
  mirroring it through state.
- `useDelayedLoading` schedules every transition on a timer (a 0 ms one when it is
  due now); the hook never writes state synchronously inside its effect.
- `useModifierKey` reads the platform through `useSyncExternalStore` — server
  output is still `Ctrl`, the client value arrives at hydration.
- `Chart`'s measuring hook uses a module-level isomorphic layout effect.
