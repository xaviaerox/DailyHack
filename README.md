# La Crónica Atemporal — DailyHack (V6.0.0) 🏴‍☠️

**La Crónica Atemporal** es un sistema de visualización de aprendizaje "Pirata" diseñado para mapear el crecimiento intelectual y técnico de forma dinámica. No es solo un portafolio; es una bitácora de navegación que se autogestiona a partir de los registros diarios.

---

## 🗺️ Visión del Proyecto
Este proyecto transforma un diario de aprendizaje convencional (`DIARIO_APRENDIZAJE.md`) en un mapa topológico interactivo. Cada hito, curso o proyecto se convierte en una recalada en el vasto océano del conocimiento.

> [!TIP]
> **Autogestión Total:** El sistema se actualiza automáticamente mediante un motor de sincronización que parsea el diario maestro, eliminando la necesidad de actualizaciones manuales en el código.

---

## ⚓ Características de la Travesía

- **Mapa de Indagaciones:** Una vista topológica con estética de pergamino antiguo, donde el camino se traza dinámicamente.
- **Archivos Centrales:** Un buscador tipo "Library" para filtrar crónicas por conceptos, categorías o etiquetas.
- **Estética "Pirata" Premium:** Uso de texturas de pergamino, tipografía clásica, elementos náuticos y animaciones fluidas con `motion`.
- **Sincronización Automatizada:** Script `npm run sync-diary` que transforma el markdown en datos estructurados.
- **X Marks the Spot:** Resaltado dinámico de la última recalada (último avance registrado).

---

## 🛠️ Stack Tecnológico

- **Núcleo:** React 19 + TypeScript.
- **Estética:** Tailwind CSS + Framer Motion (Motion).
- **Iconografía:** Lucide React (Nautical Set).
- **Datos:** Motor de parseo en Node.js para sincronización de Markdown.
- **Despliegue:** Optimizado para GitHub Pages.

---

## 📜 Instrucciones de Navegación

### Para el Cronista (Desarrollo)
1.  **Inicia el Sistema:** Ejecuta `npm run dev:full`. Esto arrancará el servidor y el vigía automático.
2.  **Escribe en el Diario:** Modifica `../DIARIO_APRENDIZAJE.md`. El mapa se actualizará al instante.
3.  **Visualiza:** Abre tu navegador y observa cómo crece el camino.

> [!TIP]
> **Git Hook Activo:** Se ha configurado un hook de Git que sincroniza el diario automáticamente antes de cada commit para asegurar que el repositorio siempre esté en orden.

### Acceso al Cuarto de Mapas (Admin)
El modo edición está protegido por una "Llave Sagrada". Solo el cronista oficial puede registrar nuevos fragmentos directamente desde la interfaz.

---

## 🤖 Gobernanza IA

Este proyecto es un ejemplo de **Vibe Coding** y **Spec-Driven Development**. Está diseñado para ser mantenido por agentes de IA como **Antigravity**, siguiendo las reglas estrictas definidas en:
- `RULES.md`: La "Constitución" del proyecto.
- `AGENT.MD`: El contexto operativo para la IA.
- `CHANGELOG.md`: El registro de batalla cronológico.

---

> [!IMPORTANT]
> **Hic Sunt Dracones:** Más allá de los registros, se encuentra el aprendizaje continuo. Cada error es un arrecife sorteado; cada éxito, una isla conquistada.
