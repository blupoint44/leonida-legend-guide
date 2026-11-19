// Leonida Legend — entry point: load the trophy data, hold tracker state,
// wire the filters, tabs, detail panel, counters and import/export.

import { loadState, saveState, exportProgress, importProgress } from './storage.js';
import { renderChecklist, renderDetail, onlineEmptyState } from './render.js';
import { renderRoadmap, renderMissables, renderSources } from './roadmap.js';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

let state = loadState();
let kindFilter = 'all';
let gradeFilter = 'all';
let query = '';
let selectedId = 28;
let activeTab = 'checklist';

const listEl = document.getElementById('trophy-list');
const detailEl = document.getElementById('detail-panel');
const resultLine = document.getElementById('result-line');
const searchInput = document.getElementById('search');
const gradeSelect = document.getElementById('grade-filter');
const spoilerToggle = document.getElementById('spoiler-toggle');

spoilerToggle.checked = state.spoilers;

function matchesFilters(trophy) {
  if (kindFilter === 'missable') {
    if (!trophy.missable) return false;
  } else if (kindFilter !== 'all' && trophy.kind !== kindFilter) {
    return false;
  }
  if (gradeFilter !== 'all' && trophy.grade !== gradeFilter) return false;
  if (query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind} ${trophy.grade}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

const handlers = {
  get selectedId() { return selectedId; },
  onSelect(id) {
    selectedId = id;
    refresh();
  },
  onToggleEarned(id, earned) {
    const set = new Set(state.earned);
    if (earned) set.add(id); else set.delete(id);
    state.earned = [...set].sort((a, b) => a - b);
    const trophy = byId.get(id);
    if (earned && trophy && trophy.target) state.counters[id] = trophy.target.count;
    saveState(state);
    refresh();
  },
  onSetCounter(id, value) {
    state.counters[id] = value;
    const trophy = byId.get(id);
    const set = new Set(state.earned);
    // Keep earned and counter in sync both ways: reaching the target earns the
    // trophy, and dropping back below it un-earns it again.
    if (trophy && trophy.target) {
      if (value >= trophy.target.count) set.add(id);
      else set.delete(id);
    }
    state.earned = [...set].sort((a, b) => a - b);
    saveState(state);
    refresh();
  },
};

function updateProgress() {
  const earnedCount = state.earned.length;
  document.getElementById('progress-count').textContent = `${earnedCount} / ${trophies.length} earned`;
  const pct = Math.round((earnedCount / trophies.length) * 100);
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('progress-sub').textContent = state.earned.includes(1)
    ? 'Platinum earned — Leonida Legend!'
    : `${pct}% toward the platinum`;
}

function refresh(includeViews = true) {
  updateProgress();
  if (kindFilter === 'online') {
    listEl.replaceChildren(onlineEmptyState());
    resultLine.textContent = 'Online filter: the official list has no online trophies.';
  } else {
    const visible = trophies.filter(matchesFilters);
    renderChecklist(listEl, visible, state, handlers);
    resultLine.textContent = `Showing ${visible.length} of ${trophies.length} trophies.`;
  }
  renderDetail(detailEl, byId.get(selectedId), state, handlers);
  if (includeViews) refreshStaticViews();
}

// The roadmap and missables views only depend on earned state, and the sources
// view never changes, so they are not rebuilt on every search keystroke.
let sourcesRendered = false;
function refreshStaticViews() {
  renderRoadmap(document.getElementById('roadmap-view'), byId, state, jumpToTrophy);
  renderMissables(document.getElementById('missables-view'), trophies, state, jumpToTrophy);
  if (!sourcesRendered) {
    renderSources(document.getElementById('sources-view'));
    sourcesRendered = true;
  }
}

function jumpToTrophy(id) {
  selectedId = id;
  kindFilter = 'all';
  gradeFilter = 'all';
  query = '';
  searchInput.value = '';
  gradeSelect.value = 'all';
  document.querySelectorAll('#kind-chips .chip').forEach((chip) => {
    chip.classList.toggle('is-active', chip.dataset.kind === 'all');
  });
  switchTab('checklist');
  refresh();
  const selected = listEl.querySelector('.trophy-card.is-selected');
  if (selected) selected.scrollIntoView({ block: 'center' });
}

function switchTab(name) {
  activeTab = name;
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.tab === name);
  });
  for (const pane of ['checklist', 'roadmap', 'missables', 'sources']) {
    document.getElementById(`pane-${pane}`).hidden = pane !== name;
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});
document.querySelectorAll('#kind-chips .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    kindFilter = chip.dataset.kind;
    document.querySelectorAll('#kind-chips .chip').forEach((c) => c.classList.toggle('is-active', c === chip));
    refresh();
  });
});
searchInput.addEventListener('input', () => {
  query = searchInput.value.trim().toLowerCase();
  refresh(false);
});
gradeSelect.addEventListener('change', () => {
  gradeFilter = gradeSelect.value;
  refresh(false);
});
spoilerToggle.addEventListener('change', () => {
  state.spoilers = spoilerToggle.checked;
  saveState(state);
  refresh();
});
document.getElementById('export-btn').addEventListener('click', () => exportProgress(state));
document.getElementById('import-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const status = document.getElementById('import-status');
  if (!file) return;
  try {
    state = await importProgress(file);
    spoilerToggle.checked = state.spoilers;
    saveState(state);
    refresh();
    status.textContent = 'Progress imported.';
  } catch {
    status.textContent = 'Import failed: that file is not valid progress JSON.';
  }
  event.target.value = '';
});

refresh();
