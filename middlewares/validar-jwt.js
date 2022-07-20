import { request, response } from "express"
import jwt from "jsonwebtoken"
import { Usuario } from '../models/index.js'


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token')
    if( !token ) res.status(401).json({error: 'Usted no esta logueado en la aplicación'})

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY )
        const usuario = await Usuario.findById(uid)

        if ( !usuario.state || !usuario ) {
            res.status(401).json({
                msg: 'Token no valido'
            })
        }

        req.usuario = usuario
        
        next()
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(401).json({
            msg_error: `Token no valido - ${error}`
        })
    }
}

export{
    validarJWT
}