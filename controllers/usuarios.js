import { response, request } from 'express'
import pkg from 'bcryptjs'

import { Usuario } from '../models/usuario.js'

const bcryptjs = pkg

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { state: true }
    
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde) == 0 ? desde : Number(desde) - 1).limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {

    const { name, email, password, role } = req.body
    const usuario = new Usuario( { name, email, password, role } )

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt )

    // Guardar en BD
    await usuario.save()

    res.json({
        usuario
    })
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params
    const { _id, password, google, email, ...resto } = req.body

    if ( password ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt )
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto )

    res.json(usuario)
}

const usuariosPatch = async (req, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    })
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params
    const usuario = await Usuario.findByIdAndUpdate(id, { state: false })    

    res.json( usuario )
}

export {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}