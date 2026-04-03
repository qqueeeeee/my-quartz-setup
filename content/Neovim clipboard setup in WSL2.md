---
created: 2026-03-04
tags:
  - systems
  - tooling
  - topic/clipboard
  - topic/neovim
  - topic/wsl2
  - workflow
people:
  - Que
places:
  []
projects:
  []
themes:
  - systems
  - tooling
  - workflow
topics:
  - clipboard
  - neovim
  - wsl2
orgs:
  []
related:
  - "[[Keyboard Centric Workflow]]"
  - "[[Neovim]]"
---

# Neovim clipboard setup in WSL2

This is the clean clipboard setup I wanted for [[Neovim]] inside WSL2.

## Notes

I use [[Neovim]] inside WSL2 and wanted a specific clipboard configuration goal. I wanted `y` and `p` to continue functioning exactly as normal [[Neovim]] operations (using the unnamed register), while `<leader>y` and `<leader>p` would target the Windows clipboard. Claude initially overcomplicated the solution with custom helpers and extra keymaps, and I pushed back because I did not want to change how `y` behaves. I just wanted the leader-prefixed versions to target a different register. Following that correction, Claude provided the correct minimal solution: setting `vim.opt.clipboard = ""` to prevent auto-syncing, then mapping `<leader>y` to `"+y` and `<leader>p`/`<leader>P` to `"+p`/`"+P`, leveraging the `+` register which WSL2 maps to the Windows clipboard via `clip.exe`. Claude also noted that a clipboard provider like `xclip` or `xsel` may need to be installed for the `+` register to function, and suggested using `:checkhealth clipboard` inside [[Neovim]] to verify. My key preference is concise, minimal solutions that work within existing [[Neovim]] conventions rather than custom workarounds.

## Related notes

- [[Keyboard Centric Workflow]]
- [[Neovim]]
