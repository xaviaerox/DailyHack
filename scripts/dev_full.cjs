const { spawn } = require('child_process');
const path = require('path');

// Rutas absolutas a los ejecutables de Node/NPM en este entorno particular
const nodePath = 'C:\\Users\\hrmadm\\Desktop\\NodeJS\\node.exe';
const npmPath = 'C:\\Users\\hrmadm\\Desktop\\NodeJS\\npm.cmd';

console.log('---------------------------------------------------------');
console.log('🏴‍☠️  ARRANCANDO SISTEMA DE CRÓNICA COMPLETO  🏴‍☠️');
console.log('---------------------------------------------------------');

// 1. Arrancar el servidor de desarrollo (Vite)
const vite = spawn(npmPath, ['run', 'dev'], { 
  stdio: 'inherit', 
  shell: true,
  env: { ...process.env, PATH: `C:\\Users\\hrmadm\\Desktop\\NodeJS;${process.env.PATH}` }
});

// 2. Arrancar el vigía del diario
const watch = spawn(nodePath, [path.join(__dirname, 'watch_diary.cjs')], { 
  stdio: 'inherit', 
  shell: true,
  env: { ...process.env, PATH: `C:\\Users\\hrmadm\\Desktop\\NodeJS;${process.env.PATH}` }
});

// Manejar cierres
vite.on('close', (code) => {
  console.log(`\n🛑 Servidor Vite cerrado (código ${code})`);
  process.exit(code);
});

watch.on('close', (code) => {
  console.log(`\n🛑 Vigía cerrado (código ${code})`);
  process.exit(code);
});

// Si este proceso muere, matar a los hijos
process.on('SIGINT', () => {
  vite.kill();
  watch.kill();
  process.exit();
});
