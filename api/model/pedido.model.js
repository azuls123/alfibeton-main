'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

const MainSchema = Schema({
    Number                      : { type: Number, default: 0, required: true },
    Client                      : { type: Schema.ObjectId, ref: 'Persona', required: true },
    OrderDate                   : { type: String, default: Moment().unix(), required: true },
    OrderTime                   : { type: String },
    DeliveryTime                : { type: String, default: Moment().unix(), required: false },
    DeliveryTimeReplace         : { type: String, default: Moment().unix(), required: false },
    GPS                         : { type: String, default: 'Bad GPS Point', required: false },
    City                        : { type: String, default: 'No City', required: true },
    Address                     : { type: String, default: 'No Address', required: true },
    AddedBy                     : { type: Schema.ObjectId, ref: 'Usuario', required: false },
    Bodega                      : { type: Schema.ObjectId, ref: 'Bodega', required: true },
    State                       : { type: String, default: 'Pendiente' },
    Total                       : { type: Number, default: 0, required: true },
    SubTotal                    : { type: Number, default: 0, required: true },
    TotalDiscount               : { type: Number, default: 0, required: true },
    TotalProdSell               : { type: Number, default: 0, required: true },
    TotalProdFree               : { type: Number, default: 0, required: true },
    SendCost                    : { type: Number, default: 0, required: true },
    Comments                    : { type: String, default: 'No Comments', required: false },
    FindedBy                    : { type: String, default: '0', required: false },
    ContactedBy                 : { type: String, default: '0', required: false },
    Deliverer                   : { type: Schema.ObjectId, ref: 'Empresa', required: false },
    DeliveredBy                     : { type: Schema.ObjectId, ref: 'Usuario', required: false },
    Image                       : { type: String, default: 'No Image' },
    Active                      : { type: Boolean, default: true },
    Created: {
        By: { type: Schema.ObjectId, ref: 'Usuario', required: false },
        At: { type: String, default: Moment().unix(), required: false }
    },
    Updated: {
        By: { type: Schema.ObjectId, ref: 'Usuario' },
        At: { type: String, default: Moment().unix(), required: false }
    }
});

module.exports = Mongoose.model('Pedido', MainSchema);
