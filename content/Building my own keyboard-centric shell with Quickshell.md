---
created: 2026-03-11
tags:
  - career
  - cs
  - desktop
  - games
  - job-search
  - learning
  - linux
  - systems
  - tooling
  - topic/c++
  - topic/compatibility
  - topic/data-structures
  - topic/desktop-shell
  - topic/dsa
  - topic/games
  - topic/glazewm
  - topic/hyprland
  - topic/interview-prep
  - topic/job-search
  - topic/linux
  - topic/resume
  - workflow
people:
  - Que
places:
  []
projects:
  []
themes:
  - career
  - cs
  - desktop
  - games
  - job-search
  - learning
  - linux
  - systems
  - tooling
  - workflow
topics:
  - c++
  - compatibility
  - data-structures
  - desktop-shell
  - dsa
  - games
  - glazewm
  - hyprland
  - interview-prep
  - job-search
  - linux
  - resume
orgs:
  []
related:
  - "[[About Me]]"
  - "[[C++]]"
  - "[[Data Structures]]"
  - "[[Featured Work]]"
  - "[[GlazeWM]]"
  - "[[Keyboard Centric Workflow]]"
  - "[[Skills]]"
  - "[[Tiling Window Managers]]"
---

# Building my own keyboard-centric shell with Quickshell

I want a custom shell that feels more like my own system than someone else's setup pasted on top of Linux.

## Notes

I am building a custom desktop shell for Hyprland on Arch Linux using Quickshell (a QML-based shell toolkit). My goal evolved during the conversation from a keyboard-centric shell to a macOS-aesthetic widget and bar system. I want the visual style of macOS — menubar, dock, notification center, and desktop widgets — implemented through Quickshell's QML component system. I showed a preference for writing my own code rather than borrowing large, complex files from other projects (explicitly rejecting a 1,300-line Celestia shell network service in favor of writing a simpler self-contained version). covered the full architecture of a Quickshell setup: how QML auto-discovers component files by filename, how to structure subdirectories with `import "bar"` and `import "widgets"`, how `PanelWindow` with `WlrLayershell` layers works for desktop widgets versus bar components, and how `pragma Singleton` with `qmldir` registration enables a global `Theme.qml` for fonts and colors. A key correction was made: components used inside `RowLayout` must not use `anchors`, as anchors conflict with the layout engine and cause overlap. I also learned that `UPower.displayDevice.percentage` returns a 0–1 float, not 0–100. Specific components built during the session include `Bar.qml` (top menubar pinned with `exclusionMode: ExclusionMode.Auto`), `BarClock.qml`, `Network.qml` (using a `Process` component running `nmcli` every 5 seconds to detect ethernet vs. wifi signal strength), and `Power.qml` (using `Quickshell.Services.UPower` with a custom drawn battery icon using layered `Rectangle` components rather than a font glyph). For fonts, I installed `apple-fonts` via AUR for SF Pro Text/Display and manually installed Material Symbols Rounded (downloaded as a zip, copied to `/usr/share/fonts/google-fonts/`, and registered with `fc-cache`). Material Symbols Rounded with `font.variableAxes: {"FILL": 1}` is used for filled system icons. The `Theme.qml` singleton uses `QtObject` (not Quickshell's `Singleton` type) with separate `fontFamily` and `fontSize` properties rather than a `font` object, due to QML limitations with passing font objects through singletons.

## Related notes

- [[About Me]]
- [[C++]]
- [[Data Structures]]
- [[Featured Work]]
- [[GlazeWM]]
- [[Keyboard Centric Workflow]]
- [[Skills]]
- [[Tiling Window Managers]]
