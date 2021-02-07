'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Pedido      : { type: Schema.ObjectId, ref: 'Pedido', required: true },
        ProductoVariante: { type: Schema.ObjectId, ref: 'Variante', required: true },
        UnitsSell   : { type: Number, default: 0 },
        UnitsFree   : { type: Number, default: 0 },
        Units       : { type: Number, default: 0 },
        UnitsProx   : { type: Number, default: 0 },
        ValueByUnits: { type: Number, default: 0 },
        Discount    : { type: Number, default: 0 },
        Percent     : { type: Number, default: 0 },
        ValueIdeal  : { type: Number, default: 0 },
        TotalDiscount: { type: Number, default: 0 },
        Received    : { type: String, default: 'Pendiente' },
        UnitsBack   : { type: Number, default: 0 },
        OrderCode   : { type: String, default: null, required: false },
        Delivered : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        FinalValue  : { type: Number, default: 0, required: true },
        FinalValueProx: { type: Number, default: 0, required: true },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('ListaPedido', MainSchema);