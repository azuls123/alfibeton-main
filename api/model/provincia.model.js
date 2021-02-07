'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Name        : { type: String, required: true }
    });
module.exports = Mongoose.model('Provincia', MainSchema);
