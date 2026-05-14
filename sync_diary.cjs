const fs = require('fs');
const path = require('path');

const DIARY_PATH = 'c:\\Users\\hrmadm\\Documents\\GitHub\\DIARIO_APRENDIZAJE.md';
const OUTPUT_PATH = path.join(__dirname, 'src', 'data', 'entries.json');

function parseDiary() {
    if (!fs.existsSync(DIARY_PATH)) {
        console.error(`Error: ${DIARY_PATH} not found.`);
        return [];
    }

    const content = fs.readFileSync(DIARY_PATH, 'utf-8');

    // Regex to find entries: ### [YYYY-MM-DD] - Title
    const entryPattern = /### \[(?<date>\d{4}-\d{2}-\d{2})\] - (?<title>.*?)\n(?<body>.*?)(?=\n### \[|---|\Z)/gs;
    
    const entries = [];
    let match;
    let i = 0;
    let yOffset = 5;

    while ((match = entryPattern.exec(content)) !== null) {
        const { date, title, body } = match.groups;
        
        // Extract Quote from [!TIP] or "Resumen para el Centro"
        let quote = "";
        const titleMatch = body.match(/> \*\*Título\*\*: (.*?)\n/);
        if (titleMatch) {
            quote = titleMatch[1].trim();
        } else {
            const descMatch = body.match(/> \*\*Descripción\*\*: (.*?)(?=\n>|\Z)/s);
            if (descMatch) {
                quote = descMatch[1].trim().replace(/\n/g, ' ');
            }
        }

        // Category heuristics
        let category = "General";
        if (title.includes("Fase")) category = "Fases";
        if (title.includes("Machine Learning") || title.includes("IA")) category = "IA";
        if (title.includes("Seguridad")) category = "Seguridad";
        if (title.includes("Configuración")) category = "Sistemas";

        // Clean content
        let cleanContent = body.replace(/>.*?\n/gs, '').trim();
        cleanContent = cleanContent.replace(/\*\*Objetivo\*\*:/, '');
        cleanContent = cleanContent.replace(/\*\*Actividades del día\*\*:/, '');
        cleanContent = cleanContent.replace(/\n/g, ' ').trim();

        // Tags
        const tags = [];
        if (body.includes("React")) tags.push("React");
        if (body.includes("Vite")) tags.push("Vite");
        if (body.includes("Node.js")) tags.push("NodeJS");
        if (body.includes("Tailwind")) tags.push("Tailwind");

        // Coordinates
        let x = i % 2 === 0 ? 20 : 80;
        x += Math.floor(Math.random() * 21) - 10; // +/- 10
        
        const dateObj = new Date(date);
        const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')} ${months[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;

        entries.push({
            id: `entry-${i}`,
            title: title.trim(),
            content: cleanContent.substring(0, 300) + (cleanContent.length > 300 ? "..." : ""),
            date: formattedDate,
            timestamp: dateObj.getTime(),
            category: category,
            coordinates: { x, y: yOffset },
            quote: quote,
            tags: [...new Set(tags)]
        });

        yOffset += 30;
        i++;
    }

    return entries;
}

const entries = parseDiary();
const dir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2), 'utf-8');
console.log(`Successfully synced ${entries.length} entries to ${OUTPUT_PATH}`);
