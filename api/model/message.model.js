'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Message     : { type: String, default: 'No Text', required: true },
        To          : { type: Schema.ObjectId, ref: 'Usuario' },
        From        : { type: Schema.ObjectId, ref: 'Usuario' },
        At          : { type: String, default: Moment().unix(), required: false }
    });

module.exports = Mongoose.model('Message', MainSchema);
