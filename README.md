# AutoTyper Community

AutoTyper Community is a small, open-source Windows text injector. It types text into the foreground window through the standard Win32 `SendInput` API and uses Unicode events so Chinese, emoji, and mixed-language text can be handled without depending on the active keyboard layout.

This repository is the intentionally simplified community edition of AutoTyper. It is useful for accessibility, demonstrations, repetitive text entry, and learning how a desktop input tool is structured. It is not the complete AutoTyper V8 source tree.

## Public feature set

- Fixed interval between Unicode code points
- Configurable 3-30 second countdown
- Locks onto the foreground target window after the countdown
- Pauses when focus leaves that target and resumes when it returns
- Global `Esc` stop shortcut while a run is active
- Progress and status updates in the application window
- Surrogate pairs are emitted atomically so emoji are not split across calls

## Intentionally not included

- Human-rhythm generation or statistical timing models
- Typist profiles, warm-up, fatigue, burst, hesitation, or motor models
- Deliberate typo generation and correction planning
- Target-duration solving and calibration logic
- AutoTyper V8 protected-release tooling or private test baselines

Those components belong to the private AutoTyper V8 project and are not licensed by this repository.

## Requirements

- Windows 10 or Windows 11, x64
- Node.js 20 or newer
- npm

## Run from source

```powershell
npm install
npm start
```

Enter text, choose a fixed interval and countdown, then click **Start typing**. During the countdown, focus the destination text field. Press `Esc` at any time to stop the current run.

## Safety and limitations

- The program uses ordinary software-generated Windows input. It is not a physical keyboard or HID device.
- It does not hide its process, evade detection, bypass application policies, or provide an automatic submission workflow.
- Elevated target windows may reject input from a non-elevated process because of Windows integrity-level isolation.
- Some applications handle Unicode input differently; test with non-sensitive text first.
- You are responsible for using the software only where automated input is permitted.

## License

The files in this public repository are licensed under the MIT License. The license does not apply to AutoTyper V8 private source code or algorithms that are absent from this repository.
