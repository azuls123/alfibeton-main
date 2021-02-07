'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Ci          : { type: String, default: 'No Ci', required: false },
        FirstName   : { type: String, default: 'No FirstName', required: true },
        LastName    : { type: String, default: 'No LastName', required: true },
        Phone       : { type: String, default: 'No Phone', required: true },
        City        : { type: Schema.ObjectId, ref: 'Parroquia'},
        Address     : { type: String, default: 'No Address', required: true },
        GPS         : { type: String, default: 'No GPS', required: true },
        Active      : { type: Boolean, default: true },
        HasAccount  : { type: Boolean, default: false },
        isDueno     : { type: Boolean, default: false },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('Persona', MainSchema);