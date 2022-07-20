import { request, response } from "express"
import { Usuario, Categoria, Producto } from '../models/index.js'
import pkg from "mongoose"

const { isValidObjectId } = pkg

const coleccionesPermitidas = [
    'categoria',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuarios = async( termino = '', res = response ) => {
    const esMongoID = isValidObjectId( termino )
    if ( esMongoID ){
        const usuario = await Usuario.findById( termino )
        return res.json({
            results: ( usuario ) ? [usuario] : []
        })
    }
    const regex = new RegExp( termino, 'i' )
    const usuarios = await Usuario.find({ 
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
     })
    res.json({
        results: usuarios
    })
}

const buscarCategorias = async( termino = '', res = response ) => {
    const esMongoID = isValidObjectId( termino )
    if ( esMongoID ){
        const categoria = await Categoria.findById( termino )
        return res.json({
            results: ( categoria ) ? [categoria ] : []
        })
    }
    const regex = new RegExp( termino, 'i' )
    const categorias = await Categoria.find( { name: regex, state: true } )
    res.json({
        results: categorias 
    })
}

const buscarProductos = async( termino = '', res = response ) => {
    const esMongoID = isValidObjectId( termino )
    if ( esMongoID ){
        const producto = await Producto.findById( termino )
        return res.json({
            results: ( producto ) ? [producto ] : []
        })
    }
    const regex = new RegExp( termino, 'i' )
    const productos = await Producto.find( { name: regex, state: true } )
    res.json({
        results: productos  
    })
}

const buscar = async (req = request, resp = response) => {
    const { coleccion, termino } = req.params

    if( !coleccionesPermitidas.includes( coleccion ) ){
        return resp.status(400).json({
            msgError: `La coleccion ${coleccion}, no existe.`,
            coleccionesPermitidas
        })
    }

    switch (coleccion) {
        case 'categoria':
            buscarCategorias(termino, resp)
            break
        case 'productos':
            buscarProductos(termino, resp)
            break
        case 'usuarios':
            buscarUsuarios(termino, resp)
            break
        default:
            resp.status(500).json({
                msgError: 'Se me olvido hacer esta busqueda'
            })
            break
    }

    //resp.json({ coleccion, termino })
}

export {
    buscar
}