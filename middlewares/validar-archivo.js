import { response } from "express"


const validarArchivoSubir = ( req, res = response, next ) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).send({
            msg_error: 'No hay archivo que subir.'
        })
    }
    next()
}

export {
    validarArchivoSubir
}