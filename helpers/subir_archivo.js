import path from 'path'
import { fileURLToPath } from "url"
import { v4 as uuidv4 } from 'uuid'

const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {
        const { archivo } = files
    
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]
        
        // validar extension
        if ( !extensionesValidas.includes(extension) ) return reject(`La extension ${ extension } no está permitida.`)
    
        const nombreTemp = uuidv4() + '.' + extension
        const uploadPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../uploads/', carpeta, nombreTemp)
        
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject({err})
            }
        
            resolve( nombreTemp )
        })
    })
    
}

export{
    subirArchivo
}