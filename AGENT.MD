# Agent Context: La Crónica Atemporal (DailyHack) 🏴‍☠️

## 🎯 Project Goal
Transform a local learning diary (`DIARIO_APRENDIZAJE.md`) into an immersive, interactive, and aesthetically "Pirate" web experience. The project maps technical growth and milestones as if they were discoveries in a vast ocean of knowledge.

## 🚀 Current Status: Fase 3 (Estética Inmersiva y Autogestión)
The project is a standalone visualization tool with the following features:
- **Topology Map**: Dynamic SVG path connecting learning entries with a parchment-style background.
- **Auto-Sync Engine**: Node.js script that parses Markdown and generates structured JSON.
- **Pirate Aesthetics**: Premium design using custom textures, nautical iconography (Anchor, Compass), and Framer Motion animations.
- **Independence**: This is a personal project separate from clinical or professional tools, focused solely on the "Cronista" (the user).

## 🛠️ Technical Stack
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS 4.
- **Animations**: Framer Motion (motion).
- **Icons**: Lucide React (Nautical set).
- **Backend**: Node.js scripts for file watching and diary parsing.
- **Architecture**: Static Site Generator (SSG) approach where data is fed from a local Markdown file.

## ⚔️ Battle Log (Latest Challenges)
- **Markdown Parsing**: Developing a robust regex-based parser for the specific diary format.
- **Dynamic Topology**: Calculating SVG paths that scale with the number of entries while maintaining a "wobble" aesthetic.
- **Session Isolation**: Ensuring the project remains lightweight and decoupled from any other clinical or professional codebases.

## 📋 Immediate Tasks
- [x] Implement the Auto-Sync engine (`sync_diary.cjs`).
- [x] Refine the Pirate parchment design.
- [x] Purge all non-relevant clinical information from the repository.
- [ ] Add "Tale of the Voyage" summary using local LLM (Optional).

## 📜 Governance
- Follow **RULES.md** strictly.
- Update **CHANGELOG.md** and **TASKS.md** after every change.
- Maintain the **Pirate Vibe**: Every UI element should feel like part of a 17th-century navigator's toolkit.
- **Independence**: Never mix code or documentation from other projects (like Queryclin) here.
