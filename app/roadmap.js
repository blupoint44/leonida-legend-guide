// Leonida Legend — roadmap stages, the Missables view and the Sources & method view.
// Stage membership is fixed by the guide's plan; trophy data itself comes from data/trophies.json.

export const STAGES = [
  { code: 'S1', title: 'Story — Chapters 1 to 4', note: 'Play the opening chapters in order. Before finishing Chapter 1, use the meditation spot on Lucia’s balcony — it disappears afterwards. Start a manual save at the beginning of every chapter.', ids: [2, 3, 4, 5, 6, 28] },
  { code: 'S2', title: 'Story — finales and set pieces', note: 'Finish the named set-piece missions and the final mission. Save manually just before the final mission: there is no mission replay and no New Game Plus.', ids: [7, 8, 9, 10, 11, 12, 13, 37] },
  { code: 'S3', title: 'Partners in crime (opens in Chapter 2)', note: 'Once both Jason and Lucia are playable in Chapter 2, the partner trophies open. Do these together in free roam while the wanted system is fresh.', ids: [33, 34] },
  { code: 'S4', title: 'Strangers and strands', note: 'Work the stranger strands across Leonida. Each named finale closes one strand, and eight finished strands earn Strangers & Freaks.', ids: [25, 22, 23, 24, 26, 27, 20, 29] },
  { code: 'S5', title: 'The Leonida grind', note: 'The long counters and collectibles: stunts, shooting-range golds, races, cards, WAiNK spots, challenges, vehicles and full map exploration. Chip away district by district.', ids: [15, 17, 18, 19, 30, 31, 32, 35, 42] },
  { code: 'S6', title: 'Crime pays', note: 'Robberies, combat feats and the money totals. The robbery trophies unlock around Chapters 3 and 4; launder marked bills after every job so the $250,000 total builds in the background.', ids: [16, 21, 36, 38, 39, 40, 41, 43, 51, 52, 53, 54, 55] },
  { code: 'S7', title: '100 percent and the last secrets', note: 'Close out 100% Completion using the in-game checklist under Progress > Stats > 100% Completion, then the cryptic one-off trophies whose methods were unconfirmed at launch. The platinum lands with the last of them.', ids: [14, 44, 45, 46, 47, 48, 49, 50, 1] },
];

export const ROADMAP_FACTS = [
  { big: '4 / 10', label: 'Approximate difficulty (PowerPyx, as reported by EGamers)' },
  { big: '~200 hours', label: 'Estimated time to the platinum (PowerPyx, as reported by EGamers)' },
  { big: '~50 hours', label: 'Story length; 100+ hours for everything (Press Start)' },
  { big: '1 playthrough', label: 'One playthrough is enough — no difficulty trophies, no online trophies (Push Square; GTABase)' },
];

const ALL_SOURCES = [
  { label: 'Official PS5 trophy list (PlayStation), as listed by Exophase and PSNProfiles', note: 'The authority for every trophy name, description and grade in this guide: 55 trophies — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze — with 28 hidden on PlayStation. The same 55 are Xbox achievements worth 1,000 Gamerscore.' },
  { label: 'Push Square — GTA 6 PS5 trophy list (18 Nov 2026)', note: 'Launch reporting of the full list (18 Nov 2026), including that there are no online trophies and no difficulty trophies and that one playthrough is enough.' },
  { label: 'PowerPyx — GTA 6 trophy guide & roadmap', note: 'Guide and roadmap reference: difficulty about 4/10, roughly 200 hours to the platinum, and Positive Mental Attitude flagged as the possible missable.' },
  { label: 'GTABase — GTA 6 trophies guide', url: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series', note: 'Trophy guide reference: no online or difficulty trophies, one playthrough suffices, cheat codes disable trophies and saving for the session, and the 100% checklist under Progress > Stats > 100% Completion counts everything done before the story ends, with nothing on it missable.' },
  { label: 'OutputLag — GTA 6 trophy list', url: 'https://outputlag.com/guides/gta-6-trophy-list/', note: 'Launch list coverage: no mission replay and no New Game Plus (hence the chapter-save rule), Positive Mental Attitude as the reported missable tied to the Chapter 1 balcony spot, most of the list opening in Chapter 2 with robberies in Chapters 3–4, cheat codes switching off trophies and saving, and five trophies with no confirmed unlock method at launch.' },
  { label: 'Press Start — GTA 6 trophy list', url: 'https://press-start.com.au/news/2026/11/18/gta-6-trophy-list/', note: 'Launch reporting (18 Nov 2026) putting the story at about 50 hours and everything at 100+ hours.' },
  { label: 'EGamers — GTA 6 trophy list', url: 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/', note: 'Launch reporting carrying the PowerPyx estimates: difficulty about 4/10 and roughly 200 hours to the platinum.' },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function trophyChip(trophy, state, onSelect) {
  const chip = el('button', 'stage-chip-btn', trophy.name);
  chip.type = 'button';
  if (state.earned.includes(trophy.id)) chip.classList.add('is-earned');
  chip.addEventListener('click', () => onSelect(trophy.id));
  return chip;
}

export function renderRoadmap(view, byId, state, onSelect) {
  view.replaceChildren();
  const intro = el('div', 'info-panel');
  intro.append(el('h2', '', 'Roadmap to the platinum'));
  intro.append(el('p', '', 'Seven stages, in the order this guide recommends playing them. One playthrough is enough: there are no difficulty trophies and no online trophies. Never use cheat codes on a trophy save — they switch off trophies and saving for the session. Click any trophy chip to jump to it in the checklist.'));
  view.append(intro);

  const grid = el('div', 'fact-grid');
  for (const fact of ROADMAP_FACTS) {
    const card = el('div', 'fact-card');
    card.append(el('div', 'fact-big', fact.big), el('div', '', fact.label));
    grid.append(card);
  }
  view.append(grid);

  for (const stage of STAGES) {
    const block = el('div', 'stage-block');
    const heading = el('h2');
    const code = el('span', 'stage-code', `${stage.code} · `);
    heading.append(code, document.createTextNode(stage.title));
    block.append(heading, el('p', '', stage.note));
    const chips = el('div', 'stage-chips');
    for (const id of stage.ids) {
      const trophy = byId.get(id);
      if (trophy) chips.append(trophyChip(trophy, state, onSelect));
    }
    block.append(chips);
    view.append(block);
  }
}

export function renderMissables(view, trophies, state, onSelect) {
  view.replaceChildren();
  const warning = el('div', 'info-panel warning-panel');
  warning.append(el('h2', '', 'The chapter-save rule'));
  warning.append(el('p', '', 'Grand Theft Auto VI has no mission replay and no New Game Plus. Protect yourself: keep a manual save at the start of every chapter, plus one separate save immediately before the final mission. If a one-time moment is missed, those saves are the only way back short of a new playthrough. (Source: OutputLag — GTA 6 trophy list.)'));
  warning.append(el('p', '', 'Also: never use cheat codes on a trophy save. Cheats switch off trophies and saving for the rest of the session. (Sources: OutputLag; GTABase.)'));
  view.append(warning);

  const flagged = trophies.filter((t) => t.missable);
  for (const trophy of flagged) {
    const block = el('div', 'stage-block');
    const heading = el('h2', '', trophy.missable === 'missable' ? `MISSABLE — ${trophy.name}` : `CAUTION — ${trophy.name}`);
    block.append(heading);
    block.append(el('p', '', trophy.description));
    block.append(el('p', '', trophy.guide));
    const chips = el('div', 'stage-chips');
    chips.append(trophyChip(trophy, state, onSelect));
    block.append(chips);
    view.append(block);
  }

  const calm = el('div', 'info-panel');
  calm.append(el('h2', '', 'Everything else'));
  calm.append(el('p', '', 'No other trophy is flagged as missable in launch reporting. In particular, nothing on the 100% Completion checklist is missable, and work done before finishing the story still counts toward it (GTABase). The remaining 53 trophies can be cleaned up in free roam after the credits.'));
  view.append(calm);
}

export function renderSources(view) {
  view.replaceChildren();
  const method = el('div', 'info-panel');
  method.append(el('h2', '', 'Sources & method'));
  method.append(el('p', '', 'How this guide was built: trophy names, descriptions and grades are reproduced exactly from the official PlayStation 5 list, as listed by Exophase and PSNProfiles. Every guide paragraph is original text written for Leonida Legend — no guide-site wording is copied. Facts that come from launch reporting (18–19 Nov 2026) are cited beside the trophy or panel that uses them. Where no unlock method was confirmed at launch — In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin, plus the other cryptic one-offs — the guide says so plainly, gives the most reasonable reading of the official description, and invents nothing. Difficulty and time estimates are attributed to PowerPyx as reported by EGamers, and to Press Start.'));
  view.append(method);

  const listPanel = el('div', 'info-panel');
  listPanel.append(el('h2', '', 'Every source used'));
  const list = el('ul', 'sources-list');
  for (const source of ALL_SOURCES) {
    const item = document.createElement('li');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = source.label;
      item.append(link);
    } else {
      const strong = el('strong', '', source.label);
      item.append(strong);
    }
    item.append(document.createTextNode(` — ${source.note}`));
    list.append(item);
  }
  listPanel.append(list);
  view.append(listPanel);
}
