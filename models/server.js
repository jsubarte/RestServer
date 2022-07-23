import express from 'express'
import cors from 'cors'
import { router } from '../routes/usuarios.js'
import { auth } from '../routes/auth.js'
import { dbConnection } from '../database/config.js'
import { categorias } from '../routes/categorias.js'
import { productos } from '../routes/productos.js'
import { rtrBuscar } from '../routes/buscar.js'
import { uploads } from '../routes/uploads.js'
import fileUpload from 'express-fileupload'


class Server{
    

    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categories: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios'
        }

        // Conectar a base de datos
        this.conectarDB()

        // Middlewares
        this.middleware()

        // Rutas de mi aplicacion
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middleware(){
        //CORS
        this.app.use(cors())

        // Lectura y Parseo del Body
        this.app.use(express.json())

        // Directorio Publico
        this.app.use( express.static('public') )

        //File Upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, auth)
        this.app.use(this.paths.buscar, rtrBuscar)
        this.app.use(this.paths.categories, categorias) 
        this.app.use(this.paths.productos, productos)
        this.app.use(this.paths.uploads, uploads)
        this.app.use(this.paths.usuarios, router)
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Aplicacion ejecutandose en puerto ${this.port}`)
        })
    }

}

export {
    Server
}
