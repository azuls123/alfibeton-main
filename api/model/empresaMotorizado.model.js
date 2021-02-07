'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

const MainSchema = Schema({
    Motorizado      : { type: Schema.ObjectId, ref: 'Persona' },
    Empresa         : { type: Schema.ObjectId, ref: 'Empresa' },
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

module.exports = Mongoose.model('EmpresaMotorizado', MainSchema);