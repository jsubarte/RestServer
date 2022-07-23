import path from 'path'
import { fileURLToPath } from "url"
import fs from 'fs'
import { response } from "express"
import { subirArchivo } from "../helpers/index.js"
import { Usuario, Producto } from "../models/index.js"
import { v2 as cloudinary } from 'cloudinary'


const cargarArchivo = async(req, res = response) => {
    
    try {
        //const nombre = await subirArchivo.subirArchivo(req.files)
        //const nombre = await subirArchivo.subirArchivo(req.files, ['txt', 'md], 'textos)
        const nombre = await subirArchivo.subirArchivo(req.files, undefined, 'imgs')
    
        res.json({ nombre })
    } catch (msg) {
        res.status(400).json({ msg })
    }
    
}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params

    let modelo

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if( !modelo ) return res.status(400).json( { msg: `No existe un usuario con el id ${id}` } )
            break
        case 'productos':
            modelo = await Producto.findById(id)
            if( !modelo ) return res.status(400).json( { msg: `No existe un producto con el id ${id}` } )
            break
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // Clean preview image
    if ( modelo.img ){
        const pathImg = path.join(path.dirname(fileURLToPath(import.meta.url)), '../uploads', coleccion, modelo.img)
        if( fs.existsSync( pathImg ) ){
            fs.unlinkSync( pathImg )
        }
    }

    const nombre = await subirArchivo.subirArchivo( req.files, undefined, coleccion )
    modelo.img = nombre
    
    await modelo.save()

    res.json( modelo )
}

const actualizarImagenCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params

    let modelo

    cloudinary.config( 
        { 
            cloud_name: process.env.CLOUDINARY_NAME, 
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        } 
    )

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if( !modelo ) return res.status(400).json( { msg: `No existe un usuario con el id ${id}` } )
            break
        case 'productos':
            modelo = await Producto.findById(id)
            if( !modelo ) return res.status(400).json( { msg: `No existe un producto con el id ${id}` } )
            break
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // Clean preview image
    if ( modelo.img ){
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[ nombreArr.length - 1 ]
        const [ public_id ] = nombre.split('.')
        cloudinary.uploader.destroy( public_id )
    }
    
    const { tempFilePath } = req.files.archivo
    
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url
    
    await modelo.save()

    res.json( modelo )
}

const mostrarImagen = async ( req, res = response ) => {
    const { id, coleccion } = req.params

    let modelo

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if( !modelo ) return res.status(400).json( { msg: `No existe un usuario con el id ${id}` } )
            break
        case 'productos':
            modelo = await Producto.findById(id)
            if( !modelo ) return res.status(400).json( { msg: `No existe un producto con el id ${id}` } )
            break
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // Clean preview image
    if ( modelo.img ){
        const pathImg = path.join(path.dirname(fileURLToPath(import.meta.url)), '../uploads', coleccion, modelo.img)
        if( fs.existsSync( pathImg ) ) return res.sendFile(pathImg) 
    }

    res.sendFile(
        path.join(path.dirname(fileURLToPath(import.meta.url)), '../assets', 'no-image.jpg')
    )
    //res.json({ msg: 'Falta el placeholder'})
}

export {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}