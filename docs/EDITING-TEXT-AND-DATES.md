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
  duration: 12.7,                     // SECONDS
  beats: {                            // named animation cues, seconds into the scene
    spinUp: 2.6,
    newRingIn: 5.4,
    bigReveal: 6.4,
    …
  },
  voice: [
    {
      id: 's4-l3',
      start: 5.5,                     // seconds into the scene
      text: '...to April to March.',
      rate: 1.16,                     // slower = heavier = emphasis
      captions: ['…to APRIL to MARCH'],
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

### Keeping repetition out

The narration deliberately says each thing once. "Salary Cycle" is spoken in
scene 1 and never again - scene 2 says "it", scene 4 says "a new cycle".
"Performance appraisal" appears once, in scene 7. If you add a line, check it
against what is already said: the screen is what repeats the key dates, not the
voice.

### Changing the pacing
This film is signage: it should never feel like it is waiting. `TRANSITION`
(0.55s) is how far consecutive scenes overlap, so the next visual builds while
the previous phrase finishes. Keep beats dense - if a scene has more than about
a second with nothing moving, move a beat earlier rather than adding filler.

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
