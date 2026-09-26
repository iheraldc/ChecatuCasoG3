import express from 'express';
import crypto from 'node:crypto';
import { readData, writeData } from '../../db/DBUsuario.js';
import { readData as readTipoDocumentos } from '../../db/DBTipoDocumento.js';

export const routes = express.Router();

const CAMPOS_OBLIGATORIOS = [
    "codTipoDocumento", "numDocumento", "nombres", "apePaterno", "apeMaterno",
    "correo", "celular", "contrasena", "confirmarContrasena"
];

// La contrasena se guarda como "salt:hash" (scrypt), nunca en texto plano
const cifrarContrasena = (contrasena) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(contrasena, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

// La contrasena nunca se devuelve en las respuestas
const sinContrasena = ({ contrasena, ...usuario }) => usuario;

const validarRegistro = (body) => {
    const errores = [];

    for (const campo of CAMPOS_OBLIGATORIOS) {
        if (typeof body[campo] !== "string" || body[campo].trim() === "") {
            errores.push(`El campo ${campo} es obligatorio`);
        }
    }
    if (errores.length > 0) return errores;

    if (!readTipoDocumentos().some(t => t.codigo === body.codTipoDocumento)) {
        errores.push("El tipo de documento no es valido");
    } else if (body.codTipoDocumento === "01" && !/^\d{8}$/.test(body.numDocumento)) {
        errores.push("El DNI debe tener 8 digitos");
    } else if (body.codTipoDocumento !== "01" && !/^[A-Za-z0-9]{6,12}$/.test(body.numDocumento)) {
        errores.push("El numero de documento debe tener entre 6 y 12 caracteres alfanumericos");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.correo)) {
        errores.push("El correo electronico no es valido");
    }
    if (!/^9\d{8}$/.test(body.celular)) {
        errores.push("El celular debe tener 9 digitos y empezar con 9");
    }
    if (body.contrasena.length < 8) {
        errores.push("La contrasena debe tener al menos 8 caracteres");
    }
    if (body.contrasena !== body.confirmarContrasena) {
        errores.push("Las contrasenas no coinciden");
    }
    if (body.aceptaTerminos !== true) {
        errores.push("Debe aceptar los terminos y condiciones");
    }

    return errores;
}

/**
* route GET /v1/api/usuarios
* Lista los usuarios registrados
**/
routes.get("/", (req, res) => {
    res.status(200).json(readData().map(sinContrasena));
});

/**
* route GET /v1/api/usuarios/:codigo
* Obtiene un usuario por su codigo
**/
routes.get("/:codigo", (req, res) => {
    const usuario = readData().find(u => u.codigo === req.params.codigo);

    if (!usuario) {
        return res.status(404).json({ mensaje: `No existe el usuario con codigo ${req.params.codigo}` });
    }

    res.status(200).json(sinContrasena(usuario));
});

/**
* route POST /v1/api/usuarios
* Registra un usuario (boton "Registrar" del formulario)
**/
routes.post("/", (req, res) => {
    const body = req.body ?? {};
    const errores = validarRegistro(body);

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Datos de registro invalidos", errores });
    }

    const usuarios = readData();
    const correo = body.correo.trim().toLowerCase();

    if (usuarios.some(u => u.codTipoDocumento === body.codTipoDocumento && u.numDocumento === body.numDocumento)) {
        return res.status(409).json({ mensaje: "Ya existe un usuario registrado con ese documento" });
    }
    if (usuarios.some(u => u.correo === correo)) {
        return res.status(409).json({ mensaje: "Ya existe un usuario registrado con ese correo" });
    }

    const nuevoUsuario = {
        codigo: String(Math.max(0, ...usuarios.map(u => Number(u.codigo))) + 1),
        codTipoDocumento: body.codTipoDocumento,
        numDocumento: body.numDocumento.trim(),
        nombres: body.nombres.trim(),
        apePaterno: body.apePaterno.trim(),
        apeMaterno: body.apeMaterno.trim(),
        correo,
        celular: body.celular,
        contrasena: cifrarContrasena(body.contrasena),
        aceptaTerminos: true,
        fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    writeData(usuarios);

    res.status(201)
        .location(`/v1/api/usuarios/${nuevoUsuario.codigo}`)
        .json(sinContrasena(nuevoUsuario));
});
