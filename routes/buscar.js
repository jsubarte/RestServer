import { Router } from "express"
import { buscar } from "../controllers/buscar.js"

export const rtrBuscar = Router()

rtrBuscar.get('/:coleccion/:termino', buscar)