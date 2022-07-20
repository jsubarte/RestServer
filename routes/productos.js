import { Router } from 'express'
import { check } from 'express-validator'
import { actualizarProducto, borrarProducto, crearProducto, obtenerProducto, obtenerProductos } from '../controllers/productos.js'
import { existeCategoria, existeProducto } from '../helpers/db_validators.js'
import { validaCampos, validaJWT, validaRoles } from '../middlewares/index.js'

export const productos = Router()

// get all products - public
productos.get('/', obtenerProductos)

// get one product by id - public
productos.get('/:id',
    [
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeProducto),
        validaCampos.validarCampos
    ],
    obtenerProducto
)

// create product - private
productos.post('/',
    [ 
        validaJWT.validarJWT,
        check('name','El nombre es obligatorio').notEmpty(),
        check('category','No es un ID válido').isMongoId(),
        check('category').custom(existeCategoria),
        //check('category','La categoria es obligatoria').notEmpty(),
        validaCampos.validarCampos
    ], crearProducto
)

// update one product by id - private
productos.put('/:id',
    [ 
        validaJWT.validarJWT,
        check('id').custom(existeProducto),
        check('category').custom(existeCategoria),
        validaCampos.validarCampos
    ], actualizarProducto
)

// delete product by id - admin
productos.delete('/:id',
    [
        validaJWT.validarJWT,
        validaRoles.esAdminRole,
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeProducto),
        validaCampos.validarCampos
    ], borrarProducto
)