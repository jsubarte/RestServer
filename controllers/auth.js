import { response } from "express"
import { Usuario } from '../models/usuario.js'
import pkg from 'bcryptjs'
import { generarJWT } from "../helpers/generar_jwt.js"

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

export {
    login
}