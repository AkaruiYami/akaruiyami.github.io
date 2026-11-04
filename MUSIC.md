# Change your featured music

Open `statics/featured-music.json`. This is the only file you need to edit to change the selection on the homepage and Music page.

- Replace a `url` to feature a different video. Paste a normal YouTube link or a `youtu.be` link.
- Set `title` to the label you want visitors to see. `description` is optional.
- Move entries up or down to reorder them. The first entry is the initial preview.
- Add an entry to feature another video, or remove one to stop featuring it.
- Save the file and publish your GitHub Pages changes as usual. Local preview reflects saved changes on refresh.

Example entry:

```json
{
  "url": "https://www.youtube.com/watch?v=jOtHEZ_YBZU",
  "title": "Surat Perpisahan Tanpa Kerelaan",
  "description": "Malay acoustic rock."
}
```

Keep entries inside the outer `[ ]`, separated by commas. No comma after the last entry. An empty list (`[]`) shows the music channel link instead.

Only this list is shown; the site never automatically adds channel uploads. The YouTube player loads when a visitor presses Play. Selecting another song stops the current player. If a video has embedding restrictions, the direct YouTube link remains available.
