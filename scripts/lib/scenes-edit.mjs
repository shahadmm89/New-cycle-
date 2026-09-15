/**
 * Editing src/config/scenes.ts in place.
 *
 * The beats of a scene are written either one per line or all on one line,
 * depending on how many there are. A replacement that assumes the multi-line
 * form silently does nothing on the others - which is exactly what happened:
 * `plan-timing --write` reported moving april's and march's beats and wrote
 * none of them, because it matched on a newline and six spaces of indent.
 *
 * So: find the `beats: { ... }` object first, edit inside it, and THROW if the
 * beat is not there. A re-timing tool that quietly half-applies is worse than
 * one that stops.
 */

/** The span of a scene's `beats: {...}` object inside its block. */
const beatsRange = (block, sceneId) => {
  const open = block.indexOf('beats: {');
  if (open < 0) throw new Error(`Scene "${sceneId}" has no beats object`);
  let depth = 0;
  for (let i = open + 'beats: '.length; i < block.length; i++) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') {
      depth--;
      if (depth === 0) return [open, i + 1];
    }
  }
  throw new Error(`Scene "${sceneId}": unbalanced braces in its beats object`);
};

/**
 * Sets one beat to `value`, whichever layout the scene uses.
 * Throws if the beat is not declared - callers should not be guessing.
 */
export const setBeat = (block, sceneId, beat, value) => {
  const [from, to] = beatsRange(block, sceneId);
  const beats = block.slice(from, to);
  // Word-boundary on the key so `monthIn` cannot match inside `monthSettle`,
  // and a lookahead for the colon so it cannot match a value.
  const re = new RegExp(`(\\b${beat}:\\s*)[0-9.]+`);
  if (!re.test(beats)) {
    throw new Error(`Scene "${sceneId}" has no beat "${beat}" to set`);
  }
  return block.slice(0, from) + beats.replace(re, `$1${value}`) + block.slice(to);
};

/** The span of one scene's object literal in the whole file. */
export const sceneBlock = (src, id) => {
  const from = src.indexOf(`    id: '${id}',`);
  if (from < 0) throw new Error(`Scene "${id}" not found in scenes.ts`);
  const next = src.indexOf('\n  {\n', from);
  return [from, next < 0 ? src.length : next];
};
