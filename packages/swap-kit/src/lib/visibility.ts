export function visibilityAwareInterval(callback: () => void, intervalMs: number): () => void {
  const tick = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    callback();
  };
  const timer = setInterval(tick, intervalMs);
  const onVisibility = () => {
    if (document.visibilityState === 'visible') tick();
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibility);
  }
  return () => {
    clearInterval(timer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', onVisibility);
    }
  };
}
