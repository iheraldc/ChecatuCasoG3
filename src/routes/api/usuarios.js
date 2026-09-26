import express from 'express';
import crypto from 'node:crypto';
import { readData, writeData } from '../../db/DBUsuario.js';
import { readData as readTipoDocumentos } from '../../db/DBTipoDocumento.js';

export const usuarios = express.Router();




usuarios.get("/", (req, res) => {
    res.json(readData());
});


usuarios.post("/", (req, res) => {
    const body = req.body ?? {};
    
    const usuarios = readData();


    const nuevoUsuario = {
        codigo: crypto.randomUUID(),
        codTipoDocumento: body.codTipoDocumento,
        numDocumento: body.numDocumento.trim(),
        nombres: body.nombres.trim(),
        apePaterno: body.apePaterno.trim(),
        apeMaterno: body.apeMaterno.trim(),
        correo: body.correo,
        celular: body.celular,
        contrasena: body.contrasena,
        aceptaTerminos: true,
        fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    writeData(usuarios);

    res.status(201)
        .location(`/v1/api/usuarios/${nuevoUsuario.codigo}`)
        .json(nuevoUsuario);
});
