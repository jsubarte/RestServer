import pkg from 'mongoose'

const { Schema, model } = pkg

const CategoriaSchema = Schema({
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
    }
})

CategoriaSchema.methods.toJSON = function () {
    const { __v, state, ...data } = this.toObject()
    return data
}

const Categoria = model('Categoria', CategoriaSchema)

export {Categoria}