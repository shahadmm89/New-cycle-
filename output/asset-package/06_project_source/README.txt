EDITABLE PROJECT SOURCE
========================================================================

remotion-project-source.zip is the project this video is rendered from. It is
a Remotion project: the film is React and TypeScript, rendered to MP4 by a
headless browser. There is no .aep, .prproj or .fcpxml, because none was used -
the "source" is code.

WHAT THAT MEANS FOR EDITING

  Changing wording, timing or colour is a text edit and a re-render. Nothing
  has to be traced or rebuilt. Everything below is one file.

  src/config/scenes.ts      the master timeline: every scene's length, every
                            phrase, when it is said, what is on screen, and the
                            named moment each animation fires on
  src/config/copy.ts        the wording that appears in more than one place -
                            month names, the cycle labels, the worked example
  src/config/branding.ts    colours, fonts, the logo placeholder
  src/config/voiceover.ts   which voice reads it, and how the audio is mixed
  src/scenes/               one file per scene, in order
  src/components/           the parts scenes are built from - the timeline, the
                            year ring, the month rail, the cards, the icons

TO RUN IT

  npm install
  npm run preview     opens Remotion Studio - scrub, jump between scenes, and
                      see edits live
  npm run render      writes output/salary-cycle-update.mp4

  The narration needs the local Kokoro model, which npm run voiceover:build
  fetches on first use. No API key, no paid service.

IF YOU ONLY WANT TO CHANGE THE WORDS

  Edit the phrase in src/config/scenes.ts, then:

    npm run voiceover:build      re-record (locally, free)
    npm run voiceover:plan -- --write    re-time the scenes around the new read
    npm run voiceover:anchor -- --write  put the month markers back on their word
    npm run check:sync && npm run check:brief
    npm run captions && npm run render

  Those are the same commands that produced the film in this package.

WHAT IS NOT IN THE ZIP

  node_modules (npm install restores it), the audio and video files (they are
  already in this package), and the Kokoro model (~325 MB, fetched on demand).
