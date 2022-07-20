import { json, request, response } from "express"
import { Usuario } from '../models/index.js'
import pkg from 'bcryptjs'
import { generarJWT } from "../helpers/generar_jwt.js"
import { googleVerify } from "../helpers/google-verify.js"

const bcryptjs = pkg

const login = async (req, res = response) => {

    const { email, password } = req.body

    try {
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ email })
        if( !usuario ) res.status(400).json({ msg: `Usuario o Contraseña incorrectos`})

        // Verificar si el usuario esta activo
        if( !usuario.state ) res.status(400).json({ msg: `Usuario o Contraseña incorrectos`})

        // Verificar la contraseña
        const validPass = bcryptjs.compareSync(password, usuario.password)
        if( !validPass ) res.status(400).json({ msg: `Usuario o Contraseña incorrectos`})

        // Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSingIn = async ( req = request, res = response ) => {
    const { id_token } = req.body

    try {
        const { email, name, img } = await googleVerify( id_token )
        let usuario = await Usuario.findOne({ email })

        if ( !usuario ) {
            const data = {
                name,
                email,
                password: ':p',
                img,
                google: true,
                role: 'USER_ROLE'
            }
            usuario = new Usuario(data)
            await usuario.save()
        }

        if( !usuario.state ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
            error
        })
    }
}

export {
    login,
    googleSingIn
}