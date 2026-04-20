```markdown
# Sistema de Diseño: La Crónica Atemporal

## 1. Overview & Creative North Star: "El Archivo Táctil"

Este sistema de diseño rechaza la esterilidad de la web moderna en favor de la calidez de un objeto físico con historia. El "North Star" creativo es **"El Archivo Táctil"**: una experiencia digital que se siente como un diario de cuero gastado, donde cada interacción emula el peso y la textura del papel de alto gramaje.

Para romper el aspecto de "plantilla", este sistema utiliza una **asimetría intencional**. No alinearemos todo de forma rígida; permitiremos que las imágenes y las citas floten con márgenes orgánicos, solapándose ligeramente sobre contenedores para crear una sensación de composición manual, casi de *scrapbook* académico. La profundidad no se busca con realismo artificial, sino a través de la superposición de tonos sepia y transiciones que imitan el movimiento del papel al pasar de página.

## 2. Paleta de Colores y Texturas

La paleta se aleja de los blancos puros y negros digitales. Buscamos la imperfección del pigmento y la celulosa.

### Roles de Color (Material Design Customization)
*   **Background / Surface:** `#fff9ee` (Hueso envejecido). Es nuestra base de papel.
*   **Primary:** `#505050` (Negro tinta diluida). Para el texto principal.
*   **Secondary:** `#805533` (Cuero desgastado). Para acentos de importancia y navegación.
*   **Tertiary:** `#644c2e` (Tierra de sombra). Para elementos decorativos y estados profundos.
*   **Surface Containers:** Desde `surface-container-lowest` (`#ffffff`) hasta `surface-dim` (`#e1dac6`) para crear estratos de papel.

### Las Reglas de Oro del Color
*   **Regla del "No-Line":** Queda estrictamente prohibido el uso de bordes sólidos de 1px para seccionar contenido. La estructura se define mediante cambios de tono (ej. un `surface-container-low` descansando sobre el `background`) o mediante el uso de espacios en blanco generosos.
*   **Textura de Alma:** Los fondos de los Hero o CTAs principales no deben ser planos. Se aplicará un gradiente radial sutil de `primary` a `primary_container` para simular la absorción desigual de la tinta en el papel.
*   **Efecto Pergamino:** Para elementos flotantes (modales), se usará **Glassmorphism Tonal**. En lugar de un desenfoque blanco, se usará un `surface-variant` con un 85% de opacidad y un `backdrop-blur(8px)`, permitiendo que el color del "papel" inferior se filtre sutilmente.

## 3. Tipografía: La Voz del Autor

Utilizamos la familia **Newsreader** (serif) como eje central. Su diseño evoca la tipografía editorial de mediados del siglo XX, con terminales que se sienten humanos y caligráficos.

*   **Display (lg, md, sm):** 3.5rem a 2.25rem. Se reserva para títulos de capítulos o grandes hitos del diario. Debe tener un *letter-spacing* ligeramente negativo (-0.02em) para emular la prensa antigua.
*   **Headline & Title:** De 2rem a 1rem. Establece la jerarquía de las notas. Los `headline-lg` deben usarse con un color `secondary` para romper la monotonía de la tinta negra.
*   **Body (lg, md, sm):** 1rem a 0.75rem. Optimizado para la lectura larga. El *line-height* debe ser generoso (1.6) para permitir que el ojo descanse entre líneas de "tinta".
*   **Labels:** 0.75rem. Usados para metadatos (fechas, etiquetas de notas). Siempre en itálica para diferenciar la "nota al pie" del pensamiento principal.

## 4. Elevación y Profundidad

En este sistema de diseño, la profundidad es **Tonal**, no estructural.

*   **Principio de Capas:** El "ascenso" de un elemento se logra aclarando u oscureciendo el tono del papel. Una tarjeta de `surface-container-highest` sobre un fondo `surface` comunica importancia sin necesidad de sombras agresivas.
*   **Sombras Ambientales:** Si un elemento debe "flotar" (como un botón de acción flotante), se usará una sombra extra-difundida: `box-shadow: 0 20px 40px rgba(81, 68, 60, 0.08)`. El color de la sombra es un derivado del `on-surface-variant`, nunca gris neutro.
*   **El "Ghost Border":** Si la accesibilidad requiere un límite, se usará `outline-variant` con una opacidad del 15%. Debe parecer una marca de presión en el papel, no una línea dibujada.

## 5. Componentes

### Botones (Las Firmas)
*   **Primario:** Fondo `secondary` (#805533), texto `on_secondary`. Sin bordes redondos agresivos (usar `sm` de 0.125rem para simular el corte de una guillotina de papel).
*   **Hover State:** Al pasar el cursor, el botón debe oscurecerse a `tertiary` y elevarse sutilmente con una sombra ambiental mínima.

### Tarjetas y Listas (Los Folios)
*   **Prohibición de Divisores:** No usar `<hr>` o bordes entre elementos de lista. La separación se logra mediante un aumento en el `padding-vertical` (siguiendo la escala de espaciado) o un cambio sutil a `surface-container-low` en el estado de hover.
*   **Asimetría:** Las tarjetas en un *feed* de diario deben tener variaciones leves en su alineación (ej. la primera tarjeta con `margin-left: 0`, la segunda con `margin-left: 1rem`) para romper la cuadrícula rígida.

### Campos de Entrada (Insumos de Tinta)
*   **Inputs:** Solo una línea inferior (estilo `primary` al 30% de opacidad). Al enfocarse (focus), la línea se anima desde el centro hacia los extremos en color `secondary`.
*   **Placeholder:** En itálicas, simulando una guía de caligrafía tenue.

### Transiciones (El Paso de Página)
Cada cambio de ruta debe incorporar un efecto de "fade-in" con un desplazamiento lateral de 20px, emulando el movimiento físico de una página que se pasa.

## 6. Do's y Don'ts

### Do's
*   **Usar el espacio en blanco como lujo:** El aire entre elementos comunica importancia.
*   **Mezclar pesos tipográficos:** Usa `body-lg` para introducciones y `body-md` para el resto.
*   **Jerarquía por Tono:** Si algo es secundario, usa `on-surface-variant` en lugar de reducir el tamaño de la fuente.

### Don'ts
*   **No usar bordes negros puros:** Destruyen la estética orgánica.
*   **No usar sombras proyectadas duras:** En un libro, nada proyecta una sombra negra y nítida.
*   **No usar animaciones "elásticas" o futuristas:** Opta por transiciones suaves y lineales que se sientan analógicas.
*   **No usar "Border-Radius: Full":** A menos que sea un avatar, mantén los bordes rectos o con un redondeado mínimo (`sm` o `md`) para mantener la esencia del papel cortado.