// Leonida Legend — progress persistence.
// State shape: { earned: [trophyId, ...], counters: { trophyId: number }, spoilers: boolean }
// Everything lives under one localStorage key; export downloads the same shape as JSON.

export const STORAGE_KEY = 'leonida-legend-progress-v1';

export function defaultState() {
  return { earned: [], counters: {}, spoilers: true };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return normaliseState(parsed);
  } catch {
    return defaultState();
  }
}

export function normaliseState(value) {
  const base = defaultState();
  if (!value || typeof value !== 'object') return base;
  if (Array.isArray(value.earned)) {
    base.earned = [...new Set(value.earned.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 55))];
  }
  if (value.counters && typeof value.counters === 'object') {
    for (const [key, val] of Object.entries(value.counters)) {
      const id = Number(key);
      const num = Number(val);
      if (Number.isInteger(id) && Number.isFinite(num) && num >= 0) base.counters[id] = Math.floor(num);
    }
  }
  if (typeof value.spoilers === 'boolean') base.spoilers = value.spoilers;
  return base;
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportProgress(state) {
  const payload = JSON.stringify(
    { app: 'leonida-legend', version: 1, exportedAt: new Date().toISOString(), ...state },
    null,
    2,
  );
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leonida-legend-progress.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importProgress(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  return normaliseState(parsed);
}
