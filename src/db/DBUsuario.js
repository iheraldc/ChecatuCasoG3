import fs from 'node:fs';

// Ruta relativa a este archivo (no a la carpeta desde donde se ejecuta node)
const archivo = new URL('../dbjson/DBUsuario.json', import.meta.url);

export const readData = () => {
    const datos = fs.readFileSync(archivo, 'utf-8');
    return JSON.parse(datos);
}

export const writeData = (usuarios) => {
    fs.writeFileSync(archivo, JSON.stringify(usuarios, null, 4));
}
