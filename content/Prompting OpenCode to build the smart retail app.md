---
created: 2026-02-25
tags:
  - cs
  - learning
  - topic/c++
  - topic/data-structures
  - topic/dsa
people:
  - Que
places:
  []
projects:
  []
themes:
  - cs
  - learning
topics:
  - c++
  - data-structures
  - dsa
orgs:
  []
related:
  - "[[C++]]"
  - "[[Data Structures]]"
---

# Prompting OpenCode to build the smart retail app

This note captures the system specification and implementation direction for the smart retail app prompt.

## Notes

I brought in a specification document for a Smart Retail Management System and asked Claude to convert it into a comprehensive prompt I could provide to OpenCode (an AI coding tool) to build the system. I specified a clear technical preference: as much of the codebase as possible should be in [[Python]], with the exception of the frontend. Claude produced a detailed OpenCode build prompt covering the full system specification, including tech stack (Flask backend, SQLite via SQLAlchemy, scikit-learn for ML, OpenCV for computer vision, SpeechRecognition and pyttsx3 for voice), six core modules (inventory management, voice-guided stock monitoring, visual billing, restock recommendation engine, sales analytics dashboard, and a chat interface), database schema, API endpoints, sample seed data, project structure, and requirements. I then requested the prompt be reformatted as a `.md` file, which Claude created as a downloadable file at `/mnt/user-data/outputs/smart_retail_prompt.md` with clean markdown formatting including tables, code blocks, and structured sections ready for direct use in OpenCode.

## Related notes

- [[C++]]
- [[Data Structures]]
