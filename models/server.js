import express from 'express'
import cors from 'cors'
import { router } from '../routes/usuarios.js'
import { auth } from '../routes/auth.js'
import { dbConnection } from '../database/config.js'

class Server{
    
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'

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
    }

    routes(){
        this.app.use(this.authPath, auth)
        this.app.use(this.usuariosPath, router)     
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
