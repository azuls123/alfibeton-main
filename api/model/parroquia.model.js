'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Name        : { type: String, required: true },
        Canton   : { type: Schema.ObjectId, ref: 'Canton' }
    });
module.exports = Mongoose.model('Parroquia', MainSchema);
