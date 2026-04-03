---
created: 2026-02-10
tags:
  - ai
  - career
  - cs
  - job-search
  - learning
  - product
  - project/selfforge
  - projects
  - topic/auth
  - topic/c++
  - topic/data-structures
  - topic/dsa
  - topic/interview-prep
  - topic/job-search
  - topic/rag
  - topic/resume
  - topic/selfforge
people:
  - Que
places:
  []
projects:
  - SelfForge
themes:
  - ai
  - career
  - cs
  - job-search
  - learning
  - product
  - projects
topics:
  - auth
  - c++
  - data-structures
  - dsa
  - interview-prep
  - job-search
  - rag
  - resume
  - selfforge
orgs:
  []
related:
  - "[[About Me]]"
  - "[[C++]]"
  - "[[Data Structures]]"
  - "[[Featured Work]]"
  - "[[Python]]"
  - "[[RAG]]"
  - "[[SelfForge]]"
  - "[[Skills]]"
---

# SelfForge auth and backend cleanup

This note is about the authentication and backend cleanup work that pushed [[SelfForge]] into a much more real app.

## Notes

I am a developer building [[SelfForge]], a full-stack personal productivity and AI analytics web application. spanned the entire development arc of adding authentication and restructuring the backend codebase. The project uses React + TypeScript + Vite + TailwindCSS + shadcn/ui on the frontend, and FastAPI + SQLAlchemy + SQLite on the backend, deployed on AWS (EC2 for backend, S3 for frontend static hosting). The project also integrates a [[RAG]]-powered AI assistant using LangChain, FAISS, and Groq API. began with I wanting to migrate Supabase authentication from an older version of the project (forge-your-focus) into the current [[SelfForge]] version which already had a working FastAPI backend. After Claude provided migration guidance that was too generic and didn't account for the existing backend structure, I pivoted to building custom JWT-based authentication directly connected to my own backend instead. I successfully implemented registration via `/register` and login via `/token` using `OAuth2PasswordRequestForm`, with bcrypt password hashing and JWT token generation using `python-jose`. A key fix was changing `formDetails.append('email', email)` to `formDetails.append('username', email)` to match OAuth2 form field naming conventions, which resolved a 422 error. A `SECRET_KEY` loading issue was also resolved by ensuring `load_dotenv()` was called before `os.getenv()`. I then implemented frontend protected routing using a `ProtectedRoute` component that checks `localStorage` for a JWT token and redirects unauthenticated users to `/auth` while preserving the originally requested URL via React Router's `location.state`. The `AppLayout.tsx` signout function was updated to clear the token from `localStorage` and redirect to `/auth`. I also asked about restructuring my backend from a single large `app.py` into a modular router-based architecture following FastAPI conventions, using `APIRouter` instances in separate router files that get registered in `app.py` via `app.include_router()`. The distinction between DB models (imported from `models.py`) and Pydantic schemas (imported from `schemas/`) was clarified, with aliases recommended to avoid naming confusion. A `core/dependencies.py` file was established to house `get_current_user` and `get_db` as shared dependencies across all routers. My existing file structure already had `api/`, `core/`, `schemas/`, and `services/` directories, and Claude recommended renaming `api/` to `routers/` and moving `verify_api.py` to `tests/`. concluded with Claude generating resume bullet points for [[SelfForge]] highlighting full-stack development, custom auth, analytics, [[RAG]]/AI integration, AWS deployment, and architectural refactoring.

## Related notes

- [[About Me]]
- [[C++]]
- [[Data Structures]]
- [[Featured Work]]
- [[Python]]
- [[RAG]]
- [[SelfForge]]
- [[Skills]]
