'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Order       : { type: Number, default: 0, required: false },
        Categoria: { type: Schema.ObjectId, ref: 'Categoria' },
        Producto : { type: Schema.ObjectId, ref: 'Producto' },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });
module.exports = Mongoose.model('ProductoCategoria', MainSchema);
