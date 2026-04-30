# Queryclin — HCE Intelligence Dashboard (V4.2.1)

Queryclin es una plataforma de exploración y análisis de **Historias Clínicas Electrónicas (HCE)** diseñada bajo principios de **privacidad absoluta y rendimiento local**. Permite al personal clínico navegar, buscar y segmentar grandes volúmenes de datos directamente en el navegador sin dependencias de red.

---

## 1. El Problema y Nuestro Propósito
El personal médico se ve frecuentemente forzado a lidiar con exportaciones masivas de HCE en formatos crudos (Texto plano o Excel). Interpretar estas sábanas de datos genera una inmensa fatiga visual y riesgo de errores. 

**Queryclin** nació con la misión de construir un motor que permitiera la navegación fluida y la búsqueda contextual profunda en vastos expedientes en milisegundos.

> [!IMPORTANT]
> **Privacidad Local-First:** Debido a la sensibilidad de los datos médicos, la arquitectura es estrictamente local. Los datos jamás abandonan la computadora; todo el procesamiento se realiza en la base de datos del cliente (IndexedDB) y la memoria del navegador.

---

## 2. Génesis del Proyecto
La visión original se basó en transformar la experiencia de auditoría clínica:
- **Simplicidad de Uso:** Un buscador central limpio que acepta la carga de archivos por arrastre.
- **Arquitectura de Escala (v3):** Capacidad para gestionar hasta **100.000 pacientes** de forma fluida mediante procesamiento paralelo (Web Workers).
- **Sintaxis Booleana Estricta:** Motor de búsqueda que soporta lógica natural (`diabetes AND asma NOT fumador`).
- **Navegación de Toma Única Activa (v4):** Rediseño del visor HCE para centrar la atención en una única sesión clínica, con timeline lateral para navegación cronológica rápida.
- **Exportación Profesional (v4):** Motor de exportación nativo a formato **Excel (.xlsx)** para facilitar el análisis externo por parte de los facultativos.
- **Resiliencia de Codificación:** Transcodificación automática (UTF8/Windows-1252/CP850) para archivos heredados de sistemas hospitalarios antiguos.

---

## 3. Arquitectura y Stack Tecnológico (V4.2.1)
El stack se compone de una **Arquitectura Limpia (Clean Architecture)** desacoplada:

- **React 19 + TypeScript:** Esquema de datos estricto para garantizar la integridad clínica.
- **Capa de Dominio (`src/core/`):** Modelos de datos y taxonomía clínica unificada.
- **Capa de Aplicación e Ingesta (`src/ingestion/`):** Workers de procesamiento paralelo y streaming de datos tabulares.
- **Capa de Infraestructura y Storage (`src/storage/`):** Persistencia en IndexedDB con fragmentación inteligente.
- **Motor de Búsqueda Clínico (`src/engine/`):** 
  - *`IndexerService.ts`*: Ingesta asíncrona con seguimiento de longitudes para BM25.
  - *`QueryEngine.ts`*: Motor de recuperación de información basado en **Okapi BM25**.
  - *`Tokenizer.ts`*: Procesamiento lingüístico con **Clinical Synonym Mapper** y expansión de consultas.

---

## 4. Evolución de Características (Roadmap)

### Fase 1-11: Evolución del Motor (Completadas ✅)
- Desde la arquitectura base hasta la implementación de **Okapi BM25** y **Clinical Synonym Mapper**.
- Resolución de auditorías clínicas y optimización para 100k+ registros.

### Fase 12: Estructura Determinista y Legibilidad (V4.2.1 - ACTUAL ✅)
- **Orden Clínico Estricto**: Visualización determinista de campos siguiendo el mapping oficial.
- **Subgrupo de Constantes**: Tablas inmutables para parámetros biométricos (IMC, constantes).
- **Formateo Inteligente**: Conversión automática de espacios múltiples en párrafos legibles.
- **Navegación Ergonómica**: Soporte para flechas de teclado.
- **Buscador Ubicuo**: Acceso global desde la cabecera.
- **Soporte XLSX**: Ingesta nativa de Excel.

---

## 5. Instrucciones de Uso y Despliegue
1. Instalar dependencias: `npm install`
2. Iniciar servidor de desarrollo: `npm run dev`

---

## 6. Estructura y Gobernanza
- **[RULES.md](RULES.md)**: El marco de gobernanza estricta.
- **[CHANGELOG.md](CHANGELOG.md)**: Registro histórico de modificaciones.
- **[TASKS.md](TASKS.md)**: Historial de tareas y objetivos.
