import express from 'express';
import https from 'node:https';
import fs from 'node:fs';
import { routes as tipodocumentos } from './routes/api/tipodocumentos.js';
import { routes as usuarios } from './routes/api/usuarios.js';

const PUERTO = 3000;

// Certificado Self-Signed (generado con openssl, ver README.md)
const opciones = {
    key: fs.readFileSync(new URL('../cert/key.pem', import.meta.url)),
    cert: fs.readFileSync(new URL('../cert/cert.pem', import.meta.url))
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use("/v1/api/tipodocumentos", tipodocumentos);
app.use("/v1/api/usuarios", usuarios);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ mensaje: `No existe el recurso ${req.method} ${req.originalUrl}` });
});

// Errores: JSON mal formado (400) o error interno (500)
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ mensaje: "El cuerpo de la peticion no es un JSON valido" });
    }
    console.error(err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
});

https.createServer(opciones, app)
    .listen(PUERTO, () => console.log(`Servidor Disponible en https://localhost:${PUERTO} para las peticiones`));
