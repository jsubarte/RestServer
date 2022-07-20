import { Router } from 'express'
import { check } from 'express-validator'
import { usuariosDelete, usuariosGet, usuariosPost, usuariosPut } from '../controllers/usuarios.js'
import { esRoleValido, emailExiste, existeUsuarioPorId } from '../helpers/db_validators.js'
import {
    validaCampos,
    validaJWT,
    validaRoles
} from '../middlewares/index.js'

export const router = Router()

router.get('/', usuariosGet )

router.post('/',
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('password', 'El password es obligatorio y mas de seis letras').isLength({ min: 6 }),
        check('email', 'El correo no es valido').isEmail(),
        check('email').custom(emailExiste),
        //check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('role').custom(esRoleValido),
        validaCampos.validarCampos
    ], usuariosPost 
)

router.put('/:id', 
    [
        check('id','No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('role').custom(esRoleValido),
        validaCampos.validarCampos
    ], usuariosPut 
)

router.delete('/:id', 
    [
        validaJWT.validarJWT,
        //validaRoles.esAdminRole,
        validaRoles.tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
        check('id','No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validaCampos.validarCampos
    ], usuariosDelete 
)