import { request, response } from "express"


const esAdminRole = async (req = request, res = response, next) => {
    if (!req.usuario) res.status(500).json({ msg: `Se quiere verificar el role sin validar el token primero.`})
    const { role, name } = req.usuario
    if ( role !== 'ADMIN_ROLE' ) res.status(401).json({ msg: `${ name } no es administrador.`})
    next()
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) res.status(500).json({ msg: `Se quiere verificar el role sin validar el token primero.`})
        if ( roles.includes(req.usuario.role) ) res.status(401).json({ msg: `El servicio requiere uno de estos roles ${ roles }`})
        next()
    }
}

export {
    esAdminRole,
    tieneRole
}