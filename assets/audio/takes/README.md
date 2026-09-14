# Retired takes

Per-line narration in a voice the film no longer uses.

These are here rather than deleted for one reason: they cost ElevenLabs credits
and cannot be remade for free. `assets/audio/lines/` - the directory the
pipeline actually reads - is gitignored precisely because what is in it is meant
to be reproducible. What is in here is not.

## alexander/

Twenty of the thirty-four phrases of the refined script, in **Alexander**
(`hIru3zkEJ3dBYHTbMy2V`). Recorded before the account reached zero credits; the
remaining fourteen were never made.

Superseded when the narrator was changed to **Dan** (`fvVBPXuE7f1iX3dZLKFy`). A
film cannot change narrator halfway, so none of these can be mixed into the
current cut.

Still useful for two things:

- **Reverting.** If the choice goes back to Alexander, copy these into
  `assets/audio/lines/` and only the missing fourteen need generating.
- **Pronunciation evidence.** `s3-l4.wav` is a take that measurably says the
  letters - 828 Hz peak F1, against a 773 Hz correct reference and a 625 Hz
  wrong one. It is the control sample that proves `npm run check:pronunciation`
  works, and the same measurement has to be repeated on the new voice. (It was
  produced with an apostrophe spelling that the script no longer uses; what
  makes it useful here is the sound, not the spelling.)

Copying one of these back into `assets/audio/lines/` puts it into the render.
Do that deliberately, never as a way to fill a gap.
