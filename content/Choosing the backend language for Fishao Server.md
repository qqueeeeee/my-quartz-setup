---
created: 2026-02-15
tags:
  - career
  - cs
  - games
  - job-search
  - learning
  - linux
  - project/fishao-server
  - projects
  - reverse-engineering
  - security
  - systems
  - topic/backend
  - topic/c++
  - topic/compatibility
  - topic/data-structures
  - topic/dsa
  - topic/fishao
  - topic/games
  - topic/interview-prep
  - topic/job-search
  - topic/linux
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
  - linux
  - projects
  - reverse-engineering
  - security
  - systems
topics:
  - backend
  - c++
  - compatibility
  - data-structures
  - dsa
  - fishao
  - games
  - interview-prep
  - job-search
  - linux
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
  - "[[Keyboard Centric Workflow]]"
  - "[[Skills]]"
  - "[[Superfighters Deluxe]]"
  - "[[Tiling Window Managers]]"
---

# Choosing the backend language for Fishao Server

This note is really about the architecture and protocol problems behind [[Fishao Server]], not just the language question.

## Notes

I am building a private server emulator for a Flash-based fishing game called [[Fishao Server|Fishao]], written in Java. I already had a server codebase with components including `ClientHandler.java`, `SessionManager.java`, `PlayerSession.java`, `Database.java`, and AMF3 parsing classes (`AMF3Reader`, `AMF3Writer`, `FrameBuffer`). I also have a `TemplateManager` system for replaying captured binary server responses. A friend is running a working reference server that uses pre-captured binary templates to replay responses. focused on diagnosing why the game client disconnected after receiving `sr.UpdateResp` during the `cr.EnterWorld` flow, and later after `cr.EnterLocation`. Through binary analysis of Wireshark captures (`enterworld.bin`, `enterlocation.bin`), Claude identified several issues: missing fields (`maintenanceTime`, `maintenanceIn`, `needLog`) in the outer `UpdateResp` structure, wrong field order in the inner `data` object, `fishingLog` being sent as integer `0` instead of empty string `""`, and missing location-specific fields (`usersAtLoc`, `fishingSpots`, `collectibleItems`, `npcesAtLoc`, `shells`, `selectedRodColor`, `selectedRodInfoId`) in the `cr.EnterLocation` response. After multiple iterations of fixing individual responses, I decided to reset and replicate the friend's template-based approach entirely. Claude created a new `TemplateOnlyHandler.java` file that maps every known command (`cr.*` and `api.*`) directly to pre-captured binary template files, bypassing all custom AMF construction. I noted that `AMF3Writer` uses `writer.writeValue()` and `writer.toBytes()` methods, `PlayerSession` is constructed with `(Socket, DataOutputStream, String sid)`, there is no `FrameBuffer` in my codebase, and `SessionManager` has no `removeSession` method. The final file was corrected to use a simple 2-byte length-prefix frame reader and match the actual existing class signatures. The game was loading to 94% and reaching `cr.EnterLocation` by end of session but full entry into the location was not yet confirmed.

## Related notes

- [[About Me]]
- [[Address Space Layout Randomization (ASLR)|ASLR]]
- [[C++]]
- [[Data Structures]]
- [[Featured Work]]
- [[Fishao Server]]
- [[Keyboard Centric Workflow]]
- [[Skills]]
- [[Superfighters Deluxe]]
- [[Tiling Window Managers]]
