---
categories:
  - References
  - Workflow
  - Linux
  - NixOS
tags:
  - references
  - workflow
  - linux
  - nixos
created: 2026-08-05
updated: 2026-08-05
aliases: []
---

NixOS is a [[Linux]] distro built around one idea; it's declarative rather than imperative. This means that instead of running commands like "sudo pacman -S discord" you would instead edit `configuration.nix` and add "discord" to it and it does what it needs to install [[discord]] .

also every program lives in its own folder under `/nix/store/`, and that folder's path includes a hash of everything that went into building it. So instead of `/usr/bin/firefox`,
you get `/nix/store/abc123…-firefox-130.0/bin/firefox`. Two versions of Firefox can coexist; one user's environment can have version A while another has B; rolling back is a single command.

The "config" is **one text file** (`configuration.nix`) that says things like "install firefox, enable bluetooth, run the SSH daemon." You run `nixos-rebuild switch` and NixOS makes reality match the file. If the result is broken, `nixos-rebuild switch --rollback` returns you to the
previous state.

Your configuration folder usually would have:
- `configuration.nix` — system-wide settings (firefox, bluetooth, services)
- `home.nix` — your personal user stuff (git config, dev tools, dotfiles)
- `flake.nix` — the orchestrator that ties it all together (see [[Flakes]])


