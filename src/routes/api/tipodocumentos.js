import express from 'express';
import { readData } from '../../db/DBTipoDocumento.js';

export const routes = express.Router();

/**
* route GET /v1/api/tipodocumentos
* Lista los tipos de documento del combo "Tipo de documento"
**/
routes.get("/", (req, res) => {
    res.status(200).json(readData());
});

/**
* route GET /v1/api/tipodocumentos/:codigo
* Obtiene un tipo de documento por su codigo
**/
routes.get("/:codigo", (req, res) => {
    const tipoDocumento = readData().find(t => t.codigo === req.params.codigo);

    if (!tipoDocumento) {
        return res.status(404).json({ mensaje: `No existe el tipo de documento con codigo ${req.params.codigo}` });
    }

    res.status(200).json(tipoDocumento);
});
