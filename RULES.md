# Reglas Estrictas del Proyecto (Queryclin)

Este documento contiene las directrices fundamentales e inviolables para el desarrollo de este proyecto. Ningún agente ni desarrollador debe ignorar estas reglas. Este archivo actúa como la "Constitución" del repositorio.

---

## 1. Actualización Continua del Changelog
- **Regla:** Todo cambio procesado (bugs, features, refactorizaciones) **DEBE** registrarse de manera autónoma en `CHANGELOG.md`.

## 2. Persistencia Histórica en TASKS.md
- **Regla:** **PROHIBIDO** borrar tareas completadas en `TASKS.md`. Este archivo debe ser un historial acumulativo de todas las fases del proyecto.

## 3. Integridad Estructural y Orden
- **Regla:** Ningún archivo de prueba, script de generación o dataset CSV puede residir en la raíz del proyecto.
- **Ubicación:** 
    - Scripts auxiliares: `/scripts`
    - Datos de prueba: `/tests/data`
    - Documentación técnica: `/docs`

## 4. Identidad del Proyecto (Queryclin)
- **Regla:** El proyecto tiene el nombre oficial y exclusivo de **Queryclin**. No se deben usar nombres anteriores en código o documentación.

## 5. Sincronía de Versión (WebApp)
- **Regla:** Tras cada cierre de fase o solución de fallo crítico, la versión visible en la interfaz (Header) debe incrementarse.

## 6. Fidelidad del Dato Clínico
- **Regla:** Se prohíbe renombrar o normalizar destructivamente los campos originales del CSV.

## 7. Principio de Escala y Resiliencia
- **Regla:** Priorizar siempre el procesamiento asíncrono y la persistencia fragmentada en IndexedDB (>100k registros).

---
*Gobernanza Queryclin - V4.2.1*
