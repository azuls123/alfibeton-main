'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Ingreso     : { type: Schema.ObjectId, ref: 'Ingreso', required: true },
        ProductoVariante: { type: Schema.ObjectId, ref: 'Variante', required: true },
        Units       : { type: Number, default: 0, required: true },
        UnitsReceiveds: { type: Number, default: 0, required: true },
        Received    : { type: String, default: 'Pendiente' },
        Active      : { type: Boolean, default: true },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('ListaIngreso', MainSchema);