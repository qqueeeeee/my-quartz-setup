---
created: 2026-02-08
tags:
  - career
  - desktop
  - games
  - job-search
  - linux
  - systems
  - tooling
  - topic/compatibility
  - topic/desktop-shell
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
  - desktop
  - games
  - job-search
  - linux
  - systems
  - tooling
  - workflow
topics:
  - compatibility
  - desktop-shell
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
  - "[[Featured Work]]"
  - "[[GlazeWM]]"
  - "[[Keyboard Centric Workflow]]"
  - "[[Skills]]"
  - "[[Tiling Window Managers]]"
---

# Styling YASB workspace buttons properly

This note is about how I got the YASB / [[GlazeWM]] workspace styling to behave the way I actually wanted.

## Notes

I am customizing YASB (Yet Another Status Bar) for Windows with [[GlazeWM]] integration, specifically working on the glazewm workspaces widget. I wanted to achieve a specific visual layout where workspace numbers and app icons are styled distinctly, with dark backgrounds for numbers and light backgrounds for icons. progressed through iterative CSS refinements, then moved into modifying the [[Python]] source code of the widget itself to achieve a layout that couldn't be accomplished with CSS alone. What I was really trying to get to was: first attempting pure CSS solutions, then realizing the desired layout required modifying YASB's [[Python]] source file (`src/core/widgets/yasb/glazewm.py`). What I actually wanted in the end was: each workspace shows its number followed by its app icons inline (`1 [icons] 2 [icons] 3 [icons]`), but when a workspace is focused, its icons disappear and only the highlighted number remains (`1 [icons] 2 3 [icons]`), with the active workspace's icons handled by a separate widget. I brought in my existing modified `glazewm.py` code and Claude rewrote it to implement this behavior using a `GlazewmWorkspaceButtonWithIcons` class containing a `number_widget` (QLabel) and `icons_container` (QWidget) with a `hide_when_focused` config option controlling icon visibility. I confirmed the result worked "pretty much perfectly." also covered how to build YASB into a distributable executable. Claude initially suggested PyInstaller approaches, but Claude and I worked to check the official YASB GitHub repository directly. Research revealed YASB uses cx_Freeze with a custom `build.py` script run from the `src/` directory, supporting both standalone builds (`python build.py build`) and MSI installers (`python build.py bdist_msi`). I encountered a "build_exe directory cannot be cleaned" error, and Claude provided multiple solutions including closing YASB before building, running as administrator, force-deleting build folders via PowerShell, and creating a `clean_build.bat` helper script. Throughout the conversation I demonstrated a preference for iterative refinement with visual feedback, and corrected Claude when CSS class names or file targets were wrong.

## Related notes

- [[About Me]]
- [[Featured Work]]
- [[GlazeWM]]
- [[Keyboard Centric Workflow]]
- [[Skills]]
- [[Tiling Window Managers]]
