import { Role } from '../models/role.js'
import { Usuario } from '../models/usuario.js'

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

export {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}