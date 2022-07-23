import pkg from 'mongoose'

const { Schema, model } = pkg

const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    description: {
        type: String, 
        default: ''
    },
    available: {
        type: Boolean, 
        default: true
    },
    img: {
        type: String
    }
})

ProductoSchema.methods.toJSON = function () {
    const { __v, state, ...data } = this.toObject()
    return data
}

const Producto = model('Producto', ProductoSchema)

export {Producto}