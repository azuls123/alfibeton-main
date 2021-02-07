'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

const MainSchema = Schema({
    Variante       : { type: String, default: 'No Variant' , required: true},
    Producto    : { type: Schema.ObjectId, ref: 'Producto', required: true },
    Created     : {
        By      : { type: Schema.ObjectId, ref: 'Usuario' },
        At      : { type: String, default: Moment().unix() }
    },
    Updated     : {
        By      : { type: Schema.ObjectId, ref: 'Usuario' },
        At      : { type: String, default: Moment().unix() }
    }
});

module.exports = Mongoose.model('Variante', MainSchema);