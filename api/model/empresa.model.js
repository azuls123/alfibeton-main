'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

const MainSchema = Schema({
    RUC             : { type: String, default: 'No RUC', required: true },
    Address         : { type: String, default: 'No Address', required: true },
    Name            : { type: String, default: 'No Name', required: true, unique: true },
    // Bodega          : { type: Schema.ObjectId, ref: 'Bodega', required: true },
    City            : { type: Schema.ObjectId, ref: 'Parroquia' },
    Admin           : { type: Schema.ObjectId, ref: 'Usuario' },
    GPS         : { type: String, default: 'No GPS', required: false },
    Representante   : { type: Schema.ObjectId, ref: 'Persona' },
    Active          : { type: Boolean, default: true },
    Created         : {
        By          : { type: Schema.ObjectId, ref: 'Usuario' },
        At          : { type: String, default: Moment().unix() }
    },  
    Updated         : {
        By          : { type: Schema.ObjectId, ref: 'Usuario' },
        At          : { type: String, default: Moment().unix() }
    }
});

module.exports = Mongoose.model('Empresa', MainSchema);