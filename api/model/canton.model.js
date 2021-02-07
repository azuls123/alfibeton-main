'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Name        : { type: String, required: true },
        Provincia      : { type: Schema.ObjectId, ref: 'Provincia' }
    });
module.exports = Mongoose.model('Canton', MainSchema);
