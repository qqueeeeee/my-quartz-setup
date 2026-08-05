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
---
home-manager is the same [[NixOS]] idea but for your *personal* settings, dotfiles (`~/.config/...`), shell aliases, git config, your tmux config etc. declared in a single `home.nix` file. Instead of editing 12 dotfiles across your home directory, you describe them once and home-manager populates the files (usually as symlinks into the nix store).

> **Resource**: [home-manager manual](https://nix-community.github.io/home-manager/).
> Section "Configuration Example" shows the shape of a typical `home.nix`.


