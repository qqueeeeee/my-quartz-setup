---
title: "Choosing the backend language for Fishao Server"
date: 2026-02-15
category: project
status: seedling
tags: ["#dsa", "#algorithms", "#fullstack", "#systems", "#projects"]
related: ["[[protocol|protocol]]", "[[Fishao Server]]", "[[Fishao Server|Fishao]]", "[[Claude|Claude]]"]
---

# Choosing the backend language for Fishao Server

This note is really about the architecture and [[protocol|protocol]] problems behind [[Fishao Server]], not just the language question.

## Notes

I am building a private server emulator for a Flash-based fishing game called [[Fishao Server|Fishao]], written in Java. I already had a server codebase with components including `ClientHandler.java`, `SessionManager.java`, `PlayerSession.java`, `Database.java`, and AMF3 parsing classes (`AMF3Reader`, `AMF3Writer`, `FrameBuffer`). I also have a `TemplateManager` system for replaying captured binary server responses. A friend is running a working reference server that uses pre-captured binary templates to replay responses. focused on diagnosing why the game client disconnected after receiving `sr.UpdateResp` during the `cr.EnterWorld` flow, and later after `cr.EnterLocation`. Through binary analysis of Wireshark captures (`enterworld.bin`, `enterlocation.bin`), Claude identified several issues: missing fields (`maintenanceTime`, `maintenanceIn`, `needLog`) in the outer `UpdateResp` structure, wrong field order in the inner `data` object, `fishingLog` being sent as integer `0` instead of empty string `""`, and missing location-specific fields (`usersAtLoc`, `fishingSpots`, `collectibleItems`, `npcesAtLoc`, `shells`, `selectedRodColor`, `selectedRodInfoId`) in the `cr.EnterLocation` response. After multiple iterations of fixing individual responses, I decided to reset and replicate the friend's template-based approach entirely. Claude created a new `TemplateOnlyHandler.java` file that maps every known command (`cr.*` and `api.*`) directly to pre-captured binary template files, bypassing all custom AMF construction. I noted that `AMF3Writer` uses `writer.writeValue()` and `writer.toBytes()` methods, `PlayerSession` is constructed with `(Socket, DataOutputStream, String sid)`, there is no `FrameBuffer` in my codebase, and `SessionManager` has no `removeSession` method. The final file was corrected to use a simple 2-byte length-prefix frame reader and match the actual existing class signatures. The game was loading to 94% and reaching `cr.EnterLocation` by end of session but full entry into the location was not yet confirmed.

## Connections

- [[protocol|protocol]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
- [[Fishao Server]] - This is the actual project gravity in the note, the thing the whole thought keeps bending back toward.
- [[Fishao Server|Fishao]] - This is the actual project gravity in the note, the thing the whole thought keeps bending back toward.
- [[Claude|Claude]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
