# Open Design Studio

A local visual workspace for drafting app and website screens before implementation. It runs in its own browser window, stores designs on your computer, and exports an approved design package that a coding assistant can build from.

![Open Design Studio interface](docs/studio-preview.svg)

## Features

- Create multiple designs and edit text, position, size, color, and corners on a draggable canvas.
- Switch between mobile and desktop canvas sizes.
- Save named versions and restore the latest version.
- Export the **latest saved version** as `design.json`, `preview.html`, and `IMPLEMENT.md`.
- Copy an implementation prompt into a Codex task or another coding assistant.

This release is a **single-screen design tool**. It does not generate designs from prompts, connect to live app data, or automatically message a Codex task. Desktop mode changes the canvas size; it does not automatically rearrange elements.

## Requirements

- Node.js 20 or newer. No npm dependencies are needed.
- A modern browser on Windows, macOS, or Linux.

## Start

Clone this repository, then run:

```sh
git clone https://github.com/BihgJosh/open-design-studio.git
cd open-design-studio
npm start
```

Open **http://127.0.0.1:4177**. On Windows, you can also run `Start Design Studio.ps1` from PowerShell. To use another port, set the `PORT` environment variable before starting Node.

```powershell
$env:PORT = 4180
npm start
```

The server listens on `127.0.0.1` only. It is intended for personal local use; it has no account system or network access controls.

## Design and handoff workflow

1. Press **New design** and describe the screen in **Design notes**.
2. Add text, buttons, or blocks. Drag an element on the canvas, then use the inspector for precise edits.
3. Press **Save version** when a design is ready for implementation.
4. Press **Send to implementation**. The package appears in `handoffs/<design-name>-<id>/`.
5. Copy the generated prompt into your Codex implementation task. The task can read the package files from the same computer.

Only the latest saved version is exported. Later draft changes stay in the studio until you save another version. The preview is a static layout reference, not a functioning app.

## Where your work is saved

| Path | Purpose |
| --- | --- |
| `data/projects.json` | All designs and version history |
| `handoffs/` | Exported implementation packages |

Both paths are ignored by Git so personal designs do not enter a public repository. To back up or move your work, close the server and copy `data/projects.json` to a safe location. To restore it, put that file in the `data/` directory before starting the server. Exported handoffs can be copied separately.

## Contributing

Issues and pull requests are welcome. Please keep designs in `data/` and exports in `handoffs/` out of commits. Run `npm test` before submitting a change. The project uses Node's built-in modules and plain HTML, CSS, and JavaScript.

## License

MIT. See [LICENSE](LICENSE).
