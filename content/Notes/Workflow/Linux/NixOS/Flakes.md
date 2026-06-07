A **flake** is just a `flake.nix` file in a directory. It does two things:
1. **Locks dependencies.** It says "I depend on nixpkgs version X, on
   home-manager version Y." Those versions are pinned in `flake.lock`. When you build, you get the *exact* same packages every time, on any machine. Reproducibility.
2. **Exposes outputs.** Things other people (or your own system) can consume:
   - `packages.default` — a compiled program
   - `nixosModules.default` — a chunk of NixOS config others can import
   - `homeManagerModules.default` — same but for personal/user config
   - `apps.default` — something you can `nix run`
   
> **Resource**: search YouTube for **"Vimjoyer flakes"**, clearest beginner walkthrough I know of.


