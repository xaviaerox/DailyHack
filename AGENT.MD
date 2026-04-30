# Agent Context: Queryclin (V4.2.1)

## 🎯 Project Goal
Build a high-performance, private, Local-First clinical search engine capable of handling 100,000+ records (HCE) with millisecond response times using IndexedDB and Okapi BM25.

## 🚀 Current Status: Fase 12 (Consolidación Industrial)
The project has reached a level of industrial maturity with the following latest features:
- **Native XLSX Support**: Ingest directly from Excel sheets.
- **3-Step Ingest Assistant**: Simplified UX for clinical staff.
- **Ubiquitous Search**: Integrated in the header for global access.
- **Smart Paragraph Formatting**: Reconstruction of readable clinical reports from raw text.
- **Keyboard Navigation**: Arrow keys for rapid patient record switching.
- **Deterministic Field Order**: Forced visual structure based on official mappings.

## 🛠️ Technical Stack
- **Frontend**: React 19 + TypeScript + Vite.
- **Storage**: IndexedDB (with fragmenting/sharding for >100k records).
- **Engine**: 
    - **BM25 Scoring**: For professional-grade relevance.
    - **Clinical Synonym Mapper**: 23+ patologies mapped.
    - **Web Workers**: For parallel, non-blocking ingestion.
- **Architecture**: Clean Architecture (Core, Engine, Ingestion, Storage, Utils).

## ⚔️ Battle Log (Latest Challenges)
- **Prototype Leak**: Fixed `push is not a function` by using `Object.create(null)` for dictionaries.
- **Legacy Encodings**: Support for CP850 and ISO-8859-1 for old hospital systems.
- **Memory Management**: Streaming CSV parsing to avoid OOM errors.

## 📋 Immediate Tasks
- [x] Implement deterministic field ordering in `HCEView.tsx`.
- [x] Implement smart paragraph formatting for clinical notes.
- [x] Add "Constantes Vitales" immutable table.
- [x] Synchronize all project documentation (README, CHANGELOG, TASKS).
- [ ] Explore Semantic Search with Transformers.js (Future).

## 📜 Governance
- Follow **RULES.md** strictly.
- Update **CHANGELOG.md** and **TASKS.md** after every change.
- Maintain **BATTLE_LOG.md** for critical technical decisions.
