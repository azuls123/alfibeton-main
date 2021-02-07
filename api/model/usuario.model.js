'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

const MainSchema = Schema({
    Bodega     : { type: Schema.ObjectId, ref: 'Bodega' },
    Password    : { type: String, default: 'No Password', required: true },
    Email       : { type: String, default: 'No Email', required: true },
    Active      : { type: Boolean, default: true },
    Persona     : { type: Schema.ObjectId, ref: 'Persona' },
    Role        : { type: String, default: 'Admin', required: false, unique: false },
    Empresa     : { type: Schema.ObjectId, ref: 'Empresa', required: false },
    Repartidor  : { type: Boolean, default: false, required: false },
    RepData     : {
        Placa:    { type: String, default: '' },
        Tipo:     { type: String, default: '' }
    },
    Created     : {
        By      : { type: Schema.ObjectId, ref: 'Usuario' },
        At      : { type: String, default: Moment().unix() }
    },
    Updated     : {
        By      : { type: Schema.ObjectId, ref: 'Usuario' },
        At      : { type: String, default: Moment().unix() }
    }
});

module.exports = Mongoose.model('Usuario', MainSchema);