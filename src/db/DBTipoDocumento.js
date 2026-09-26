import fs from 'node:fs';

// Ruta relativa a este archivo (no a la carpeta desde donde se ejecuta node)

export const readData = () => {
    const datos = fs.readFileSync('./dbjson/DBTipoDocumento.json', 'utf-8');
    return JSON.parse(datos);
}
