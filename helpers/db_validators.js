import { Categoria, Producto, Role, Usuario } from '../models/index.js'

const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({ role })
    if( !existeRol ) throw new Error(`El rol ${ role } no está registrado en la BD`)
}

const emailExiste = async (email) => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ email })
    if( existeEmail ) throw new Error(`El email ${ email }, ya está registrado en la BD`)
}

const existeUsuarioPorId = async (id) => {
    // Verificar si el id existe
    const existeUsuario = await Usuario.findById(id)
    if( !existeUsuario ) throw new Error(`El id ${ id }, no está registrado en la BD`)
}

const existeCategoria = async (id) => {
    const existeCategory = await Categoria.findById(id)
    if( !existeCategory ) throw new Error(`No existe ninguna categoria con el id ${ id }, en la BD`)
}

const existeProducto = async (id) => {
    const existeProduct = await Producto.findById(id)
    if( !existeProduct ) throw new Error(`No existe ningun producto con el id ${ id }, en la BD`)
}

export {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}