import { Router } from 'express'
import { check } from 'express-validator'
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from '../controllers/categorias.js'
import { existeCategoria } from '../helpers/db_validators.js'
import { validaCampos, validaJWT, validaRoles } from '../middlewares/index.js'

export const categorias = Router()

// get all categories - public
categorias.get('/', obtenerCategorias)

// get one category by id - public
categorias.get('/:id',
    [
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeCategoria),
        validaCampos.validarCampos
    ], 
    obtenerCategoria
)

// create category - private
categorias.post('/', 
    [ 
        validaJWT.validarJWT,
        check('name','El nombre es obligatorio').notEmpty(),
        validaCampos.validarCampos
    ], crearCategoria
)

// update one category by id - private
categorias.put('/:id',
    [ 
        validaJWT.validarJWT,
        check('name','El nombre es obligatorio').notEmpty(),
        check('id').custom(existeCategoria),
        validaCampos.validarCampos
    ], 
    actualizarCategoria
)

// Delete one category - admin
categorias.delete('/:id',
    [
        validaJWT.validarJWT,
        validaRoles.esAdminRole,
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeCategoria),
        validaCampos.validarCampos
    ],
    borrarCategoria
)