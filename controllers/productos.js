import { request, response } from "express"
import { Categoria, Producto } from "../models/index.js"

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    const { limite = 0, desde = 0 } = req.query
    const query = { state: true }
    
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                .populate({path: 'user', select: 'name -_id', strictPopulate: false})
                .populate({path: 'category', select: 'name -_id', strictPopulate: false})
                .skip(Number(desde) == 0 ? desde : Number(desde) - 1)
                .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

// obtenerProducto by Id - populate - {}
const obtenerProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params
        const producto = await Producto.findById({ _id: id })
                                        .populate({path: 'user', select: 'name -_id', strictPopulate: false})
                                        .populate({path: 'category', select: 'name -_id', strictPopulate: false})
        res.json(producto)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const crearProducto = async ( req = request, res = response ) => {
    try {
        const { state, user, ...body } = req.body
        const productoDB = await Producto.findOne( { name: body.name } )
        
        if( productoDB ){
            return res.status(400).json({
                msg_error: `El producto ${ productoDB.name }, ya existe`
            })
        }
        
        // Generar data a guardar
        const data = {
            name: body.name.toUpperCase(),
            user: req.usuario._id,
            ...body
        }
    
        const producto = new Producto( data )
    
        // GuardarDB
        await producto.save()
        
        res.status(201).json({
            msg: `Producto ${ body.name.toUpperCase() } creado exitosamente.`
        })
    } catch (error) {
        console.log(error)
    }
}

// actualizarProducto
const actualizarProducto = async ( req = request, res = response ) => {
    try {
        const { id } = req.params
        const { user, state, ...data } = req.body
        
        if( data.nombre ){
            data.name = data.name.toUpperCase()
        }
        data.user = req.user

        const producto = await Producto.findByIdAndUpdate( id, data, { new: true } )
        
        res.json(producto)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// borrarProducto - state:false
const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params
    const producto = await Producto.findByIdAndUpdate(id, { state: false }, { new: true })
    
    res.json( producto )
}

export {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}