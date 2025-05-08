export function useNextTick(fn: Fn) {
  return () => Promise.resolve(fn())
}