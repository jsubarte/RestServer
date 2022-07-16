import { Router } from 'express'
import { usuariosDelete, usuariosGet, usuariosPatch, usuariosPost, usuariosPut } from '../controllers/usuarios.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar_campos.js'
import { esRoleValido, emailExiste, existeUsuarioPorId } from '../helpers/db_validators.js'

export const router = Router()

router.get('/', usuariosGet )

router.post('/',[
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('password', 'El password es obligatorio y mas de seis letras').isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(emailExiste),
    //check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom(esRoleValido),
    validarCampos
], usuariosPost )

router.put('/:id', [
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').custom(esRoleValido),
    validarCampos
], usuariosPut )

router.patch('/', usuariosPatch )

router.delete('/:id', [
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete )
