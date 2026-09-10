# Changing dates, wording and timing

Two files, and nothing else.

## Dates and recurring phrases → `src/config/copy.ts`

Every date and month name in the film comes from one object:

```ts
export const cycle = {
  performanceClose: 'December',        // when the appraisal cycle closes (unchanged)
  performanceCloseShort: 'DEC',

  bonusMonth: 'March',                 // payroll month the bonus is paid
  bonusMonthShort: 'MAR',
  bonusPayrollLabel: 'MARCH PAYROLL',

  meritEffectiveDate: 'April 1',       // when merit increases take effect
  meritEffectiveLabel: 'EFFECTIVE APRIL 1',

  meritPayroll: 'April',               // payroll month the new salary appears in
  meritPayrollShort: 'APR',
  meritPayrollLabel: 'APRIL PAYROLL',

  oldCycleWindow: 'January–December',
  newCycleWindow: 'March–April',
};
```

Change a value here and it updates **the animation, the narration script and the
subtitles together** - they all read the same object. The KPI names
(`kpis`) and the month strip (`months`) live in the same file.

> After changing a date, re-run `npm run voiceover:build` so the narration says
> the new one, then `npm run captions` and `npm run render`.

Note the two `spoken:` overrides in `src/config/scenes.ts` (scene 5 and scene 9):
they exist so the narrator says "April **first**" and "H R" rather than
"April 1" and "hr". If you change those dates, update the override to match.

## On-screen copy, narration and timing → `src/config/scenes.ts`

This is the master timeline. Each scene looks like this:

```ts
{
  id: 'new-cycle',
  title: '5 - The new timing',
  duration: 17,                       // SECONDS
  beats: {                            // named animation cues, seconds into the scene
    railDraw: 0.5,
    marchHighlight: 5.7,
    bonusCard: 6.4,
    …
  },
  voice: [
    {
      id: 's5-l2',
      start: 5.8,                     // seconds into the scene
      text: 'This means your bonus will be paid in the March payroll.',
      captions: ['This means your bonus will be paid', 'in the March payroll.'],
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
