import express from 'express';
import https from 'node:https';
import fs from 'node:fs';
import { tipoDocumento } from './routes/api/tipodocumentos.js';
import { usuarios } from './routes/api/usuarios.js';

const PUERTO = 3000;

// Certificado Self-Signed (generado con openssl, ver README.md)
const opciones = {
    key: fs.readFileSync('../cert/key.pem'),
    cert: fs.readFileSync('../cert/cert.pem')
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use("/v1/api/tipodocumentos", tipoDocumento);
app.use("/v1/api/usuarios", usuarios);

https.createServer(opciones, app)
    .listen(PUERTO, () => console.log(`Servidor Disponible en https://localhost:${PUERTO} para las peticiones`));

