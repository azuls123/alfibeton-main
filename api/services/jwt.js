'use strict'

const JWT = require('jwt-simple');
const Moment = require('moment');
const Key = 'Developed_By_RoLes_DevTeam_©_[@Treinor,_@Azuls123]';

exports.createToken = function (usuario) {
    const Role = usuario.Role;
    const Persona = usuario.Persona;
    const Payload = {
        id          : usuario._id,
        Name        : Persona.FirstName + ' ' + Persona.FirstName + ' ',
        LastName    : Persona.LastName + ' ' + Persona.MothersName,
        Role        : Role,
        Phone       : Persona.Phone,
        City        : Persona.City,
        Address     : Persona.Address,
        Email       : usuario.Email,
        At          : Moment().unix(),
        Expiration  : Moment().add(15, 'days').unix()
    }
    return JWT.encode(Payload, Key);
}