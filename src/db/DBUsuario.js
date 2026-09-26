import fs from 'node:fs';



export const readData = () => {
    const datos = fs.readFileSync('./src/dbjson/DBUsuario.json', 'utf-8');
    return JSON.parse(datos);
}

export const writeData = (datos) =>{
    try{
        fs.writeFileSync('./src/dbjson/DBUsuario.json', JSON.stringify(datos));
    }catch (error){
        console.log(error);
    }
}