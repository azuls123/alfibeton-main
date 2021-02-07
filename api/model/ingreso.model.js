'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Number          : { type: Number, default: 0, required: true },
        Bodega          : { type: Schema.ObjectId, ref: 'Bodega', required: true },
        BodegaTraslado  : { type: Schema.ObjectId, ref: 'Bodega', required: false },
        SuggestedDate   : { type: String },
        SuggestedTime   : { type: String },
        Received        : {
            By          : { type: Schema.ObjectId, ref: 'Usuario' },
            At          : { type: String, default: Moment().unix(), required: false }
        },
        Active          : { type: Boolean, default: true },
        Created         : {
            By          : { type: Schema.ObjectId, ref: 'Usuario' },
            At          : { type: String, default: Moment().unix(), required: false }
        },
        Updated         : {
            By          : { type: Schema.ObjectId, ref: 'Usuario' },
            At          : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('Ingreso', MainSchema);
