import { Router } from "express"
import { check } from "express-validator"

import { validaCampos, validaArchivo } from "../middlewares/index.js"
import { actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from "../controllers/uploads.js"
import { dbValidators } from "../helpers/index.js"

export const uploads = Router()

uploads.post('/', validaArchivo.validarArchivoSubir, cargarArchivo)

uploads.put('/:coleccion/:id',
    [
        validaArchivo.validarArchivoSubir,
        check('id','El id debe ser de Mongo').isMongoId(),
        check('coleccion').custom( c => dbValidators.coleccionesPermitidas( c, ['usuarios','productos']) ),
        validaCampos.validarCampos
    ], 
    actualizarImagenCloudinary
)

uploads.get('/:coleccion/:id',
    [
        check('id','El id debe ser de Mongo').isMongoId(),
        check('coleccion').custom( c => dbValidators.coleccionesPermitidas( c, ['usuarios','productos']) ),
        validaCampos.validarCampos
    ],
    mostrarImagen
)