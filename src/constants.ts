import { Entry } from './types';

export const SAMPLE_ENTRIES: Entry[] = [
  {
    id: '1',
    title: 'El Desafío de la Capa 2',
    content: 'Hoy entendí por qué el bucle de switching puede tumbar toda una red. Configurar STP no es solo tirar comandos, es entender el latido del tráfico.',
    date: '10 SEP, 2023',
    timestamp: new Date('2023-09-10').getTime(),
    category: 'Redes',
    coordinates: { x: 15, y: 15 },
    quote: 'Un broadcast storm es el silencio más ruidoso de un administrador.',
    tags: ['Cisco', 'Switching', 'STP']
  },
  {
    id: '2',
    title: 'Permisos Octales y la Sombra del Root',
    content: 'chmod 700 es mi nuevo mejor amigo. Entender la diferencia entre sudo y su - ha sido clave para no romper el kernel esta mañana.',
    date: '22 SEP, 2023',
    timestamp: new Date('2023-09-22').getTime(),
    category: 'Sistemas',
    coordinates: { x: 65, y: 35 },
    quote: 'En Linux, todo es un archivo, incluso tus errores.',
    tags: ['Linux', 'Bash', 'Security']
  },
  {
    id: '3',
    title: 'Primer Escaneo con Nmap',
    content: 'Silencioso pero mortal. Lanzar un escaneo -sS me hizo sentir como si estuviera golpeando suavemente las puertas de una fortaleza.',
    date: '05 OCT, 2023',
    timestamp: new Date('2023-10-05').getTime(),
    category: 'Hacking',
    coordinates: { x: 25, y: 75 },
    quote: 'La curiosidad es el primer paso hacia la vulnerabilidad.',
    tags: ['Nmap', 'Recon', 'CyberSec']
  },
  {
    id: '4',
    title: 'Inyección de SQL en el Laboratorio',
    content: 'Un simple guion y una comilla pueden abrir lo que se supone que estaba cerrado. Las bases de datos nunca volverán a parecerme seguras.',
    date: '18 OCT, 2023',
    timestamp: new Date('2023-10-18').getTime(),
    category: 'Seguridad',
    coordinates: { x: 75, y: 110 },
    quote: "' OR 1=1 -- es la llave maestra de la era digital.",
    tags: ['WebHacking', 'SQLi', 'Laboratorio']
  },
  {
    id: '5',
    title: 'La Magia de Python para Automatización',
    content: 'Escribí un script que escanea logs y me avisa por Telegram cuando detecta fuerza bruta. Me siento como un pequeño arquitecto de seguridad.',
    date: '02 NOV, 2023',
    timestamp: new Date('2023-11-02').getTime(),
    category: 'Scripts',
    coordinates: { x: 40, y: 160 },
    quote: 'Un administrador cansado es un administrador que no sabe programar.',
    tags: ['Python', 'Automation', 'SSH']
  },
  {
    id: '6',
    title: 'Examen Final de Redes Convergentes',
    content: 'VLANs, VPNs y redundancia. Mi cabeza es ahora una topología de red compleja pero funcional. Certificado de supervivencia obtenido.',
    date: '20 NOV, 2023',
    timestamp: new Date('2023-11-20').getTime(),
    category: 'Certificación',
    coordinates: { x: 80, y: 210 },
    quote: 'El ping es el "hola" que salva vidas.',
    tags: ['ASIR', 'Finals', 'Success']
  }
];
