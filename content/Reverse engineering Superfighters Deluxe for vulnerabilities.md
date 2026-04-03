---
created: 2026-03-08
tags:
  - career
  - cs
  - games
  - job-search
  - learning
  - project/fishao-server
  - projects
  - reverse-engineering
  - security
  - systems
  - topic/backend
  - topic/c++
  - topic/data-structures
  - topic/dsa
  - topic/fishao
  - topic/interview-prep
  - topic/job-search
  - topic/protocols
  - topic/resume
  - topic/reverse-engineering
  - topic/security
  - topic/sfd
people:
  - Que
places:
  []
projects:
  - Fishao Server
themes:
  - career
  - cs
  - games
  - job-search
  - learning
  - projects
  - reverse-engineering
  - security
  - systems
topics:
  - backend
  - c++
  - data-structures
  - dsa
  - fishao
  - interview-prep
  - job-search
  - protocols
  - resume
  - reverse-engineering
  - security
  - sfd
orgs:
  []
related:
  - "[[About Me]]"
  - "[[Address Space Layout Randomization (ASLR)|ASLR]]"
  - "[[C++]]"
  - "[[Data Structures]]"
  - "[[Featured Work]]"
  - "[[Fishao Server]]"
  - "[[Skills]]"
  - "[[Superfighters Deluxe]]"
---

# Reverse engineering Superfighters Deluxe for vulnerabilities

This note captures the practical reverse-engineering paths that actually worked while digging into [[Superfighters Deluxe]].

## Notes

I used this chat while reverse engineering [[Superfighters Deluxe]] (SFD) to find vulnerabilities for the game developer. I have prior experience with ILSpy decompilation, Harmony patching, DLL injection via doorstop, Cheat Engine, and Wireshark-based packet inspection. My explicit learning goal is to improve C++ skills through this real project, starting from being able to read C++ but not write it confidently. covered extensive ground across two approaches. First, a C# internal DLL approach was explored: using dnSpy to map the game's object graph (GameSFD.Handle → Server → GameInfo → GameWorld → ScriptBridge.GetPlayers() → IPlayer[] → GetHealth()/SetHealth()), writing a Harmony/doorstop-based mod, and attempting injection via doorstop v4, BepInEx, and dnSpy direct assembly editing. All injection methods failed — doorstop and BepInEx rely on Unity/Mono infrastructure SFD lacks, and dnSpy editing produced unresolvable reference errors. then shifted to a C++ external DLL approach injected via Cheat Engine: signature scanning for the JIT-compiled `SFD.BarMeter::set_CurrentValue` function (signature: `55 8B EC 56 8B F1 D9 45 08 D9 46 08 D9 C0 DF F2`), hooking it with MinHook using `__fastcall` convention, and successfully reading and freezing all player health values. I confirmed health freezing worked. ended exploring EasyHook as a potential managed C# injection solution, with a combined injector/mod assembly compiling successfully but not yet tested. I work on SFD version 1.5.0 (64-bit, Steam) for primary targets but tested on 1.4.2 (32-bit) during this session. Key technical constraints established: .NET garbage collection makes pointer chains unreliable, JIT compilation means IL stubs appear in CE until functions are actually called at runtime, and all standard Unity-based injection tools fail for this game. I prefer direct answers and working code over guided discovery when I explicitly request it, and pushed back several times when Claude continued Socratic questioning after I asked for code directly. I also corrected Claude when fabricated API paths (e.g., `Game.GameWorld`) were presented as fact, and Claude acknowledged these errors. A known SFD modding reference is the SFR project (github.com/Odex64/SFR) by Odex64, which uses Harmony but is broken on current SFD versions.

## Related notes

- [[About Me]]
- [[Address Space Layout Randomization (ASLR)|ASLR]]
- [[C++]]
- [[Data Structures]]
- [[Featured Work]]
- [[Fishao Server]]
- [[Skills]]
- [[Superfighters Deluxe]]
