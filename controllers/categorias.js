import { request, response } from "express"
import { Categoria } from "../models/index.js"

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 0, desde = 0 } = req.query
    const query = { state: true }
    
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate({path: 'user', select: 'name -_id', strictPopulate: false}).skip(Number(desde) == 0 ? desde : Number(desde) - 1).limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })
}

// obtenerCategoria - populate - {}
const obtenerCategoria = async (req = request, res = response) => {
    try {
        const { id } = req.params
        const categoria = await Categoria.findById({ _id: id }).populate({path: 'user', select: 'name -_id', strictPopulate: false})
        res.json(categoria)
    } catch (error) {
        console.log(error)
    }
}

//
const crearCategoria = async ( req = request, res = response ) => {
    try {
        const name = req.body.name.toUpperCase()
        const categoriaDB = await Categoria.findOne( { name } )
    
        if( categoriaDB ){
            return res.status(400).json({
                msg_error: `La categoria ${ categoriaDB.name }, ya existe`
            })
        }
    
        // Generar data a guardar
        const data = {
            name,
            user: req.usuario._id
        }
    
        const categoria = new Categoria( data )
    
        // GuardarDB
        await categoria.save()
        
        res.status(201).json({
            msg: `Categoria ${ name } creada exitosamente.`
        })
    } catch (error) {
        console.log(error)
    }
}

// actualizarCategoria
const actualizarCategoria = async ( req = request, res = response ) => {
    const { id } = req.params
    const { user, state, ...data } = req.body

    data.name = data.name.toUpperCase()
    data.user = req.user

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } )

    res.json(categoria)
}

// borrarCategoria - state:false
const borrarCategoria = async (req = request, res = response) => {
    const { id } = req.params
    const categoria = await Categoria.findByIdAndUpdate(id, { state: false }, { new: true })
    
    res.json( categoria )
}

export {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}