import express from 'express';
import { readData } from '../../db/DBTipoDocumento.js';

export const tipoDocumento = express.Router();


tipoDocumento.get("/", (req, res) => {
    res.status(200).json(readData());
});

