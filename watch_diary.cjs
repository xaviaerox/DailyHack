const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Ruta al diario de aprendizaje (un nivel arriba)
const targetFile = path.resolve(__dirname, '../DIARIO_APRENDIZAJE.md');
const syncScript = path.resolve(__dirname, 'sync_diary.cjs');

console.log('---------------------------------------------------------');
console.log('🏴‍☠️  VIGÍA DE LA CRÓNICA ATEMPORAL  🏴‍☠️');
console.log(`📡 Observando cambios en: ${targetFile}`);
console.log('---------------------------------------------------------');

// Función para ejecutar la sincronización
function sync() {
  const nodePath = process.env.PATH.includes('NodeJS') ? 'node' : '"C:\\Users\\hrmadm\\Desktop\\NodeJS\\node.exe"';
  
  exec(`${nodePath} "${syncScript}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error en la sincronización: ${error.message}`);
      return;
    }
    if (stderr) {
      // Ignorar advertencias menores de node
      if (!stderr.includes('ExperimentalWarning')) {
        console.error(`⚠️ Advertencia: ${stderr}`);
      }
    }
    console.log(`✅ [${new Date().toLocaleTimeString()}] Sincronización completada.`);
    // console.log(stdout); // Opcional: mostrar salida del script
  });
}

// Ejecutar una vez al inicio
sync();

// Vigilar el archivo
// Usamos fs.watch con un pequeño debounce para evitar ejecuciones múltiples en guardados rápidos
let timer = null;
fs.watch(targetFile, (eventType) => {
  if (eventType === 'change') {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(`📜 Cambio detectado en el pergamino maestro...`);
      sync();
    }, 100);
  }
});

// Manejar cierre
process.on('SIGINT', () => {
  console.log('\n👋 El vigía abandona su puesto. ¡Buen viaje, capitán!');
  process.exit();
});
