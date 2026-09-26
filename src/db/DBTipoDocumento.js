import fs from 'node:fs';

// Ruta relativa a este archivo (no a la carpeta desde donde se ejecuta node)
const archivo = new URL('../dbjson/DBTipoDocumento.json', import.meta.url);

export const readData = () => {
    const datos = fs.readFileSync(archivo, 'utf-8');
    return JSON.parse(datos);
}
