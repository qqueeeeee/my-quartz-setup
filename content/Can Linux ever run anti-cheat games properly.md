---
created: 2026-03-05
tags:
  - games
  - linux
  - systems
  - topic/compatibility
  - topic/games
  - topic/linux
people:
  - Que
places:
  []
projects:
  []
themes:
  - games
  - linux
  - systems
topics:
  - compatibility
  - games
  - linux
orgs:
  []
related:
  - "[[Keyboard Centric Workflow]]"
  - "[[Tiling Window Managers]]"
---

# Can Linux ever run anti-cheat games properly

This is basically me trying to understand where the real limits are for Linux gaming once anti-cheat gets involved.

## Notes

I was interested in switching to Linux but was worried about losing access to specific games, mainly Fortnite and Rainbow Six Siege. I asked whether it would be possible to build something that lets those games run on Linux and how hard that would actually be. Claude explained that tools like Proton/Steam Play, Lutris, and Heroic already cover a lot of Windows-to-Linux compatibility, and pointed me to ProtonDB as the best quick reality check for game-specific support. The real blocker with my two target games is anti-cheat: Fortnite uses Easy Anti-Cheat and Siege uses BattlEye, and both depend on the developer opting into Linux support. So this is not really a pure technical impossibility as much as a developer/business decision. We also got into the idea of building a bypass, and Claude made the point that anti-cheat lives deep enough in the stack that this quickly turns into kernel-level systems work, constant cat-and-mouse patching, TOS violations, and ban risk. The practical options were dual-booting, waiting/pushing for better Linux support, or just picking games that already work properly through Proton.

## Related notes

- [[Keyboard Centric Workflow]]
- [[Tiling Window Managers]]
