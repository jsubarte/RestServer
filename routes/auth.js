import { Router } from 'express'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar_campos.js'
import { googleSingIn, login } from '../controllers/auth.js'

export const auth = Router()

auth.post('/login', [
    check('email', 'El correo no es valido').isEmail(),
    check('password','La contraseña es obligatoria').notEmpty(),
    validarCampos
], login)

auth.post('/google', [
    check('id_token', 'Token de google es necesario').notEmpty(),
    validarCampos
], googleSingIn)