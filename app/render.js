// Leonida Legend — checklist cards and the trophy detail panel.
// Spoiler rule: with spoiler protection on, an unearned trophy of kind "story"
// shows only a masked placeholder — no name, no description, no guide —
// until it is ticked as earned.

export const SPOILER_PLACEHOLDER = 'Hidden story trophy — finish it to reveal';

export function isMasked(trophy, state) {
  return state.spoilers && trophy.kind === 'story' && !state.earned.includes(trophy.id);
}

export function gradeChip(grade) {
  const chip = document.createElement('span');
  chip.className = `grade-chip grade-${grade}`;
  chip.textContent = grade;
  return chip;
}

export function flagBadge(trophy) {
  if (trophy.missable === 'missable') {
    const badge = document.createElement('span');
    badge.className = 'missable-badge';
    badge.textContent = 'MISSABLE';
    return badge;
  }
  if (trophy.missable === 'caution') {
    const badge = document.createElement('span');
    badge.className = 'caution-badge';
    badge.textContent = 'CAUTION';
    return badge;
  }
  return null;
}

function counterText(trophy, state) {
  if (!trophy.target) return '';
  const current = state.counters[trophy.id] ?? 0;
  return `${current.toLocaleString('en-US')} / ${trophy.target.count.toLocaleString('en-US')} ${trophy.target.unit}`;
}

export function buildTrophyCard(trophy, state, handlers) {
  const card = document.createElement('div');
  card.className = 'trophy-card';
  if (state.earned.includes(trophy.id)) card.classList.add('is-earned');
  if (handlers.selectedId === trophy.id) card.classList.add('is-selected');
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'earn-box';
  box.checked = state.earned.includes(trophy.id);
  box.setAttribute('aria-label', `Mark trophy ${trophy.id} as earned`);
  box.addEventListener('click', (event) => event.stopPropagation());
  box.addEventListener('change', () => handlers.onToggleEarned(trophy.id, box.checked));
  card.append(box);

  const main = document.createElement('div');
  main.className = 'card-main';
  const masked = isMasked(trophy, state);
  const name = document.createElement('div');
  name.className = 'card-name';
  name.textContent = masked ? SPOILER_PLACEHOLDER : trophy.name;
  const desc = document.createElement('div');
  desc.className = 'card-desc';
  desc.textContent = masked ? 'Spoiler protection is on. Earn this story trophy in game, then tick it here to reveal its name and guide.' : trophy.description;
  if (masked) desc.classList.add('masked-note');
  main.append(name, desc);

  const meta = document.createElement('div');
  meta.className = 'card-meta';
  meta.append(gradeChip(trophy.grade));
  const kind = document.createElement('span');
  kind.className = 'kind-chip';
  kind.textContent = trophy.kind;
  const stage = document.createElement('span');
  stage.className = 'stage-chip';
  stage.textContent = `Stage ${trophy.stage}`;
  meta.append(kind, stage);
  const badge = flagBadge(trophy);
  if (badge) meta.append(badge);
  if (trophy.target) {
    const pill = document.createElement('span');
    pill.className = 'counter-pill';
    pill.textContent = counterText(trophy, state);
    meta.append(pill);
  }
  main.append(meta);
  card.append(main);

  card.addEventListener('click', () => handlers.onSelect(trophy.id));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlers.onSelect(trophy.id);
    }
  });
  return card;
}

export function renderChecklist(listEl, trophies, state, handlers) {
  listEl.replaceChildren();
  for (const trophy of trophies) listEl.append(buildTrophyCard(trophy, state, handlers));
}

export function onlineEmptyState() {
  const wrap = document.createElement('div');
  wrap.className = 'empty-state';
  const heading = document.createElement('h2');
  heading.textContent = 'No online trophies — honestly';
  const body = document.createElement('p');
  body.textContent = 'The official PlayStation 5 list for Grand Theft Auto VI contains no online trophies at all. Launch reporting of the full 55-trophy list is explicit on this point: every trophy, including the platinum, can be earned offline in a single playthrough, and there are no difficulty trophies either. This filter stays in the toolbar so the absence is visible rather than hidden.';
  const cite = document.createElement('p');
  cite.textContent = 'Sources: Push Square — GTA 6 PS5 trophy list (18 Nov 2026); GTABase — GTA 6 trophies guide.';
  wrap.append(heading, body, cite);
  return wrap;
}

export function renderDetail(panel, trophy, state, handlers) {
  panel.replaceChildren();
  if (!trophy) {
    const hint = document.createElement('p');
    hint.textContent = 'Select a trophy to see its official description, guide, counter and sources.';
    panel.append(hint);
    return;
  }
  const masked = isMasked(trophy, state);
  const eyebrow = document.createElement('div');
  eyebrow.className = 'card-meta';
  eyebrow.append(gradeChip(trophy.grade));
  const kind = document.createElement('span');
  kind.className = 'kind-chip';
  kind.textContent = `${trophy.kind} · Stage ${trophy.stage}`;
  eyebrow.append(kind);
  const badge = flagBadge(trophy);
  if (badge) eyebrow.append(badge);
  panel.append(eyebrow);

  const title = document.createElement('h2');
  title.textContent = masked ? SPOILER_PLACEHOLDER : trophy.name;
  panel.append(title);

  const desc = document.createElement('p');
  desc.className = 'official-desc';
  desc.textContent = masked
    ? 'Name, description and guide are hidden by spoiler protection until this story trophy is earned.'
    : trophy.description;
  panel.append(desc);

  if (!masked) {
    const guideHeading = document.createElement('h3');
    guideHeading.textContent = 'Guide (in our own words)';
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    panel.append(guideHeading, guide);

    if (trophy.target) {
      const counterHeading = document.createElement('h3');
      counterHeading.textContent = `Progress counter — ${trophy.target.unit}`;
      panel.append(counterHeading);
      panel.append(buildCounterControl(trophy, state, handlers));
    }

    const sourcesHeading = document.createElement('h3');
    sourcesHeading.textContent = 'Sources for this trophy';
    const list = document.createElement('ul');
    list.className = 'sources-list';
    for (const source of trophy.sources) {
      const item = document.createElement('li');
      if (source.url) {
        const link = document.createElement('a');
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = source.label;
        item.append(link);
      } else {
        item.textContent = source.label;
      }
      list.append(item);
    }
    panel.append(sourcesHeading, list);
  }

  const earnRow = document.createElement('label');
  earnRow.className = 'earn-row';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = state.earned.includes(trophy.id);
  box.addEventListener('change', () => handlers.onToggleEarned(trophy.id, box.checked));
  const earnText = document.createElement('span');
  earnText.textContent = 'Earned';
  earnRow.append(box, earnText);
  panel.append(earnRow);
}

function buildCounterControl(trophy, state, handlers) {
  const wrap = document.createElement('div');
  wrap.className = 'counter-control';
  const current = state.counters[trophy.id] ?? 0;

  const minus = document.createElement('button');
  minus.type = 'button';
  minus.textContent = '−';
  minus.setAttribute('aria-label', 'Decrease counter');
  minus.addEventListener('click', () => handlers.onSetCounter(trophy.id, Math.max(0, current - 1)));

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = String(trophy.target.count);
  input.value = String(current);
  input.setAttribute('aria-label', `Count for ${trophy.name}`);
  input.addEventListener('change', () => {
    const value = Math.max(0, Math.min(trophy.target.count, Math.floor(Number(input.value) || 0)));
    handlers.onSetCounter(trophy.id, value);
  });

  const plus = document.createElement('button');
  plus.type = 'button';
  plus.textContent = '+';
  plus.setAttribute('aria-label', 'Increase counter');
  plus.addEventListener('click', () => handlers.onSetCounter(trophy.id, Math.min(trophy.target.count, current + 1)));

  const label = document.createElement('span');
  label.textContent = `/ ${trophy.target.count.toLocaleString('en-US')} ${trophy.target.unit}`;

  wrap.append(minus, input, plus, label);
  return wrap;
}
