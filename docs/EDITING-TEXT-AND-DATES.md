# Changing dates, wording and timing

Two files, and nothing else.

## Dates and the cycle definition → `src/config/copy.ts`

The central idea of the film - which months the salary cycle runs between -
lives in one object:

```ts
export const cycle = {
  oldCycleFrom: 'JAN',   oldCycleTo: 'DEC',    // the cycle being left behind
  oldCycleFromLong: 'JANUARY', oldCycleToLong: 'DECEMBER',

  newCycleFrom: 'APR',   newCycleTo: 'MAR',    // the new salary cycle
  newCycleFromLong: 'APRIL',  newCycleToLong: 'MARCH',

  meritEffectiveDate: 'APRIL 1',               // merit + promotion take effect
  bonusPayrollLabel: 'MARCH PAYROLL',          // bonus is paid
  performanceClose: 'DECEMBER',                // appraisal closes - unchanged
};
```

Two month orders sit alongside it, and both are used on screen:

```ts
monthsCalendar   // JAN..DEC - the cycle we are leaving
monthsSalaryYear // APR..MAR - the new salary year
```

Seeing the same rail with a different first month is what makes the change
concrete, so if you move the cycle start you must rotate `monthsSalaryYear` to
match, and update `APRIL_INDEX` in `src/scenes/Scene04TheChange.tsx` - that
constant is how far the year ring turns.

The three anchors the film exists to plant are also here, in the order they
fall within the new salary year rather than in order of importance:

```ts
export const anchors = [
  {month: 'APRIL',    what: 'Merit + Promotion',             tone: 'new'},
  {month: 'DECEMBER', what: 'Performance Appraisal Closes',  tone: 'steady'},
  {month: 'MARCH',    what: 'Bonus',                         tone: 'new'},
];
```

`tone: 'steady'` is what colours December differently in every scene it appears
in. It is a clarification, not a change, and the palette says so.

The key company KPIs the bonus is measured against sit alongside them:

```ts
export const kpis = ['HSE', 'FINANCE', 'PERFORMANCE'] as const;
```

They are named once in the narration and never explained - the three icons and
the bracket that gathers them into COMPANY PERFORMANCE do the rest.

### The worked example

Scene 8 explains the implementation year: because the cycle start moves from
January to April, the changeover period runs fifteen months rather than twelve,
so merit is calculated across fifteen.

```ts
const IMPLEMENTATION_MONTHS = 15;
const MERIT_EXAMPLE_PCT = 5;
```

Every number on screen - `0.417%`, `6.25%`, the `15 MONTHS` chip, the length of
the rail - is derived from those two constants, so changing the example cannot
leave the arithmetic on screen wrong. Change them, then re-run
`npm run voiceover:build`: the spoken version of each figure lives in the
`spoken:` overrides of that scene's voice lines and has to be updated by hand
("six point two five percent").

> After changing a date, re-run `npm run voiceover:build` so the narration says
> the new one, then `npm run captions` and `npm run render`.

Note the `spoken:` overrides in `src/config/scenes.ts` - they exist so the
narrator says "April **first**" and "H R" rather than "April 1" and "hr". If you
change those dates, update the override to match.

## On-screen copy, narration and timing → `src/config/scenes.ts`

This is the master timeline. Each scene looks like this:

```ts
{
  id: 'the-change',
  title: '4 - THE CHANGE (hero)',
  duration: 7.09,                     // SECONDS
  beats: {                            // named animation cues, seconds into the scene
    spinUp: 1.3,
    newRingIn: 3.9,
    bigReveal: 4.15,
    …
  },
  voice: [
    {
      id: 's4-l2',
      start: 3.63,                    // seconds into the scene
      text: 'From April to March.',
      spoken: 'From April, to March.',
      rate: 1.12,                     // slower = heavier = emphasis
      captions: ['From APRIL to MARCH'],
    },
  ],
  text: { … },                        // everything written on screen in this scene
}
```

### Changing what is written on screen
Edit the `text` block of the scene. Watch the length - most on-screen strings sit
inside a fixed-width card. Render a still (`npm run still -- 1400`) to check.

### Changing a scene's length
Change `duration`. Scene start times are **derived** from the durations above
them, so everything after it shifts automatically and the composition length
updates itself. Nothing else needs editing.

### Changing when something animates
Move the number in `beats`. Components ask for beats by name
(`useProgress('bonusCard', 0.6)`), so there is never a frame number to hunt for.
Removing a beat that a scene still uses fails loudly with a message naming the
scene and the beat.

**The rule these numbers follow: the visual never arrives before the words.**
A beat lands on, or just after, the moment the narrator says the thing it shows.
To place one precisely, find where the word actually falls inside its recorded
phrase - `assets/audio/lines/<line-id>.wav` - rather than estimating from the
phrase's start. Guessing tends to run half a second early, which is exactly the
amount that makes a film feel like the pictures are racing the voice.

### Keeping repetition out

The narration deliberately says each thing once. "Salary cycle" is spoken in
scene 1 and never again - scene 2 says "it", scene 4 says "a new cycle".
"Performance appraisal" appears once, in scene 7. If you add a line, check it
against what is already said: the screen is what repeats the key dates, not the
voice.

### Changing the pacing
This film is signage: it should never feel like it is waiting, and it should
never feel rushed either. `TRANSITION` (0.55s) is how far consecutive scenes
overlap, so the next visual builds while the previous phrase finishes.

The gaps between phrases are the pacing. Aim for 0.4-0.8s after a statement and
up to about 1.2s before a major reveal; anything longer wants something still
moving on screen to cover it. If a scene feels slow, shorten a gap - do not
speed the voice up, and never stretch a scene with a beat that does nothing.

### Changing what the narrator says
Edit `text` in the `voice` array, and keep `captions` in step - those short
chunks are what appears as subtitles. Then:

```bash
npm run voiceover:build   # re-says the line, re-measures it, re-syncs captions
npm run captions
npm run render
```

`voiceover:build` warns if a line no longer fits its slot and tells you which
scene to lengthen.

## Checklist after any change

```bash
npm run typecheck
npm run voiceover:build      # only if narration or dates changed
npm run captions
npm run render:preview       # quick look
npm run render               # final
```
