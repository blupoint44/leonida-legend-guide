[![GTA 6 Trophy Guide on make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Leonida Legend rank](https://make.fun/badge/gta6-trophy-guide-01/blupoint44/leonida-legend-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Leonida Legend reward](https://make.fun/badge/gta6-trophy-guide-01/blupoint44/leonida-legend-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

An offline, static web guide and progress tracker for all **55 official PlayStation 5 trophies** of Grand Theft Auto VI: 1 Platinum, 2 Gold, 6 Silver and 46 Bronze (28 of them hidden on PlayStation). The same 55 are Xbox achievements worth 1,000 Gamerscore.

## Features

- **Full checklist** — every trophy with its official name, description and grade, plus an original guide paragraph written for this guide and a per-trophy sources line.
- **Progress tracking** — tick trophies as earned; progress persists in `localStorage`. Trophies with a count target (250 stunts, 100 WAiNK locations, $250,000 laundered, and more) get a small counter that is stored too, and reaching the target ticks the trophy.
- **Export / import** — download your progress as a JSON file and import it back on any browser.
- **Filters & search** — filter by kind (All / Story / Missable / Collectibles / Activities / Online), by grade, and by free text. The official list has **no online trophies**, so the Online filter shows an honest, cited empty state instead of pretending otherwise.
- **Spoiler protection** — on by default: unearned story trophies show only a masked placeholder ("Hidden story trophy — finish it to reveal") until you tick them as earned.
- **Roadmap** — a seven-stage path to the platinum with a difficulty/time panel (about 4/10 difficulty and roughly 200 hours per PowerPyx as reported by EGamers; story about 50 hours per Press Start; one playthrough is enough).
- **Missables view** — Positive Mental Attitude is the one reported missable (a Chapter 1 meditation spot on Lucia's balcony disappears after Chapter 1), Catch Me If You Can carries a caution flag, and the chapter-save rule is spelled out: there is no mission replay and no New Game Plus, so keep a manual save at the start of every chapter and one before the final mission.
- **Sources & method view** — every source used, with links, and an honest note on method: where an unlock method was unconfirmed at launch (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin, and other cryptic one-offs), the guide says so and invents nothing.

## Run it

No build step and no dependencies. With Node 22:

```sh
node serve.ts
```

then open http://localhost:8080. Or serve the `app/` folder with any static file server. The app loads nothing from the network — every file it uses lives under `app/`.

## Data method & sources

Trophy names, descriptions and grades are reproduced exactly from the official PS5 trophy list (PlayStation), as listed by Exophase and PSNProfiles. Guide text is original. Launch facts are drawn from, and cited to: Push Square's trophy list report (18 Nov 2026), the PowerPyx trophy guide & roadmap, GTABase's trophies guide, OutputLag's trophy list, Press Start's trophy list (18 Nov 2026), and EGamers' trophy list coverage. Difficulty/time figures are attributed estimates from those reports, not measurements.

No Rockstar logo, artwork, box art or game screenshots are used anywhere; the theme is pure CSS gradients.
