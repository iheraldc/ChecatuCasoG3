# Checa tu Caso - Registro de Usuario Grupo 03
Integrantes:
- Klaus Gatjens
- Daniel Prado
- Christian Asto


API REST que implementa el formulario **Registro de Usuario** del aplicativo
[Checa tu Caso](https://checatucaso.osiptel.gob.pe/#/mnt/registro) de OSIPTEL.

Curso de Laboratorio de backend inteligente y apis autónomas

## Tecnologias

- Node.js (ES Modules)
- Express 5
- Servidor HTTPS con certificado Self-Signed
- REST Client (extension de VS Code) para las peticiones

## Estructura

```
Examen_parcial/
├── cert/                    # Certificado Self-Signed (key.pem, cert.pem)
├── src/
│   ├── db/                  # Lectura y escritura de los archivos JSON
│   ├── dbjson/              # Valores parametricos y datos (JSON)
│   ├── routes/api/          # Rutas (cada archivo declara "routes")
│   └── index.js             # Servidor HTTPS
├── request.http             # Peticiones para REST Client
└── package.json
```

## Instalacion y ejecucion

```bash
npm install
npm start        # o "npm run dev" para reiniciar con nodemon
```

El servidor queda disponible en `https://localhost:3000`.

## Recursos

| Verbo | Ruta | Descripcion | Status Code |
|-------|------|-------------|-------------|
| GET  | `/v1/api/tipodocumentos` | Lista los tipos de documento | 200 |
| GET  | `/v1/api/tipodocumentos/:codigo` | Obtiene un tipo de documento | 200, 404 |
| GET  | `/v1/api/usuarios` | Lista los usuarios registrados | 200 |
| GET  | `/v1/api/usuarios/:codigo` | Obtiene un usuario | 200, 404 |
| POST | `/v1/api/usuarios` | Registra un usuario | 201, 400, 409 |

Cualquier otra ruta responde `404`, un JSON mal formado responde `400` y un error
inesperado responde `500`.

### Valores parametricos (`src/dbjson/DBTipoDocumento.json`)

| Codigo | Descripcion |
|--------|-------------|
| 01 | DNI |
| 04 | Carnet de Extranjeria |
| 07 | Pasaporte |
| 08 | Documento Legal Identidad requerido S.N.Migraciones |

### Registro de usuario (`POST /v1/api/usuarios`)

Campos del formulario:

```json
{
    "codTipoDocumento": "01",
    "numDocumento": "72345678",
    "nombres": "Ana Lucia",
    "apePaterno": "Torres",
    "apeMaterno": "Quispe",
    "correo": "atorres@autonoma.edu.pe",
    "celular": "912345678",
    "contrasena": "MiClave2026",
    "confirmarContrasena": "MiClave2026",
    "aceptaTerminos": true
}
```

Validaciones:

- Todos los campos son obligatorios (los marcados con `*` en el formulario).
- El tipo de documento debe existir; el DNI debe tener 8 digitos y los demas
  documentos entre 6 y 12 caracteres alfanumericos.
- Correo con formato valido y celular de 9 digitos que empiece con 9.
- Contrasena de al menos 8 caracteres e igual a la confirmacion.
- Se deben aceptar los terminos y condiciones.
- No puede repetirse el documento ni el correo de otro usuario (`409`).

La contrasena se guarda cifrada (scrypt) en `src/dbjson/DBUsuario.json` y nunca se
devuelve en las respuestas. El usuario de ejemplo tiene la contrasena `Clave2026`.

## Peticiones

Abrir `request.http` en VS Code con la extension **REST Client** y hacer clic en
`Send Request` sobre cada peticion.

## Certificado Self-Signed

El certificado ya esta incluido en `cert/`. Para generarlo de nuevo:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout cert/key.pem -out cert/cert.pem \
  -subj "/C=PE/ST=Lima/L=Lima/O=Grupo 03/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

> En Git Bash para Windows anteponer `MSYS_NO_PATHCONV=1` al comando.

Al ser autofirmado, el navegador mostrara una advertencia de seguridad y con `curl`
se debe usar la opcion `-k`.
