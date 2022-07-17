import { Router } from 'express'
import { check } from 'express-validator'
import { login } from '../controllers/auth.js'
import { validarCampos } from '../middlewares/validar_campos.js'

export const auth = Router()

auth.post('/login', [
    check('email', 'El correo no es valido').isEmail(),
    check('password','La contraseña es obligatoria').notEmpty(),
    validarCampos
], login)