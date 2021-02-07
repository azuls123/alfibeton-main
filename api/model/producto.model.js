'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const ProductoSchema = Schema({
        Name        : { type: String, default: 'No Name', required: true },
        Description : { type: String, default: 'No Description', required: true },
        Brand       : { type: String, default: 'Alfibeton', required: false },
        Color       : { type: String, default: 'No Color', required: false },
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
module.exports = Mongoose.model('Producto', ProductoSchema);
