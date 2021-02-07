'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Date            : { type: String, default: Moment().unix() },
        Units           : { type: Number, default: 0, required: false },
        UnitsProx           : { type: Number, default: 0, required: false },
        Ins             : { type: Number, default: 0, required: false },
        InsProx         : { type: Number, default: 0, required: false },
        Moved           : { type: Number, default: 0, required: false },
        MovedProx       : { type: Number, default: 0, required: false },
        Outs            : { type: Number, default: 0, required: false },
        OutsProx        : { type: Number, default: 0, required: false },
        CostIn            : { type: Number, default: 0, required: false },
        CostInProx        : { type: Number, default: 0, required: false },
        CostOut            : { type: Number, default: 0, required: false },
        CostOutProx        : { type: Number, default: 0, required: false },
        Bodega          : { type: Schema.ObjectId, ref: 'Bodega', required: true },
        Variante        : { type: Schema.ObjectId, ref: 'Variante', required: true },
        ListaPedido     : { type: Schema.ObjectId, ref: 'ListaPedido', required: false },
        ListaIngreso    : { type: Schema.ObjectId, ref: 'ListaIngreso', required: false },
        Description     : {type: String}
    });

module.exports = Mongoose.model('Stock', MainSchema);