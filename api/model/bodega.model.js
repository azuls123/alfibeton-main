'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

const MainSchema = Schema({
    // City        : { type: Schema.ObjectId, ref: 'Parroquia', required: true },
    Address     : { type: String, default: 'No Address', required: true },
    Name        : { type: String, default: 'No Name', required: true },
    Phone       : { type: String, default: 'No Phone', required: true },
    By          : { type: Schema.ObjectId, ref: 'Usuario' },
    Color       : { type: String, default: 'No Color', required: false },
    GPS         : { type: String, default: 'No GPS', required: false },
    Active      : { type: Boolean, default: true },
    Created     : {
        By      : { type: Schema.ObjectId, ref: 'Usuario' },
        At      : { type: String, default: Moment().unix() }
    },
    Updated     : {
        By      : { type: Schema.ObjectId, ref: 'Usuario' },
        At      : { type: String, default: Moment().unix() }
    }
});

module.exports = Mongoose.model('Bodega', MainSchema);
