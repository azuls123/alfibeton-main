'use strict'

const Usuario = require('../model/usuario.model');
const Bcrypt = require('bcrypt-nodejs');
const JWT = require('../services/jwt');
const Moment = require('moment');
// funciones
// CREATE
function Create(req, res) {
    const params = req.body;
    const usuario = new Usuario();
    let noAc = "", noPas = "", noEm = "", noPer = "", noRole = "";

    if (!params.Password) noPas = "[Password]"; if (!params.Email) noEm = "[Email]"; if (!params.Persona) noPer = "[Persona]"; if (!params.Role) noRole = "[Role]";

    if (params.Password && params.Email && params.Persona && params.Role) {

        // usuario.Account    = params.Account    ;
        usuario.Email = params.Email;
        usuario.Active = params.Active;
        usuario.Persona = params.Persona;
        usuario.Role = params.Role;
        // console.log(params, usuario);
        if (params.Empresa) {
            usuario.Empresa = params.Empresa;
        }
        if (req.usuario) {
            usuario.Created.By = req.usuario.id;
        }
        if (params.Bodega) {
            usuario.Bodega = params.Bodega;
        }
        usuario.Repartidor = params.Repartidor;
        if (params.RepData) {
            usuario.RepData.Placa = params.RepData.Placa;
            usuario.RepData.Tipo = params.RepData.Tipo;
        }
        Bcrypt.hash(params.Password, null, null, (error, CryptedPassword) => {
            usuario.Password = CryptedPassword

            if (error) return res.status(500).send({ Message: 'Error while crypt Password for Usuario' });

            usuario.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({ Message: 'Error while save Usuario', ErrorSave });
                if (stored && stored != null) {
                    return res.status(201).send({ Message: 'Usuario Saved!', Usuario: stored });
                } else return res.status(404).send({ Message: 'Error: Usuario Saved null' });
            });
        });
    } else {
        return res.status(500).send({
            Message: 'Error creating Usuario, Required Fields: ' + noAc + ' ' + noPas + ' ' + noEm + ' ' + noPer + ' ' + noRole
        });
    }
}

// LOGIN
function Login(req, res) {
    const Params = req.body;
    const Email = Params.Email;
    const Password = Params.Password;

    Usuario.findOne({ Email, Active: true }).populate({
        path: 'Persona Empresa Bodega',
        populate: {
            path: 'Representante Admin Persona City By',
            populate: {
                path: 'Persona Canton',
                populate: {
                    path: 'Provincia'
                }
            }
        }
    }).exec((Error, usuario) => {
        if (Error) return res.status(500).send({ Message: 'Error while login process', Error });
       //  console.log(usuario);
        if (usuario) {
            Bcrypt.compare(Password, usuario.Password, (ErrorPassword, check) => {
                if (ErrorPassword) return res.status(500).send({ Message: 'Error while comparing passwords!!', ErrorPassword });
                if (check) {
                    usuario.Password = 'Private';
                    usuario.Expiration = Moment().add(15, 'days').unix();
                    return res.status(200).send({
                        Token: JWT.createToken(usuario),
                        Usuario: usuario,
                    })
                    // return empleado data
                    // return res.status(200).send({Message: 'empleado Logged Succeful', empleado, ErrorPassword});
                } else {
                    return res.status(401).send({ Message: 'Wrong Password' });
                }
            });
        } else {
            return res.status(404).send({ Message: 'Wrong Account or unregistered usuario' });
        }
    });
}

// READ
function Read(req, res) {
    const Active = req.params.active;
    let Query = Usuario.find({ Active }, {Password: 0});

    if (!Active || (Active != 'true' && Active != 'false')) Query = Usuario.find({}, {Password: 0})
    Query.populate({
        path: 'Created.By Updated.By Persona Empresa Bodega',
        populate: {
            path: 'Persona City By',
            populate: {
                path: 'Canton Persona',
                populate: {
                    path: 'Provincia'
                }
            }
        }

    }).exec((Error, Response) => {
        if (Error) return res.status(500).send({ Message: 'Internal Server Error', Error });
        if (!Response) return res.status(404).send({ Message: 'Collection not Found' });
        if (Response == null || Response == undefined) return res.status(200).send({ Message: 'No Collections registered' });
        return res.status(200).send({ Message: 'Query Succeful', Usuarios: Response });
    })
}
function ReadMotorizados(req, res) {
    const Empresa = req.params.empresa;
    Usuario.find({Empresa, Role: 'Motorizado'}).populate({
        path: 'Created.By Updated.By Persona Empresa Bodega',
        populate: {
            path: 'Persona City By',
            populate: {
                path: 'Canton Persona',
                populate: {
                    path: 'Provincia'
                }
            }
        }
    }).exec((Error, Response) => {
        if (Error) return res.status(500).send({ Message: 'Internal Server Error', Error });
        if (!Response) return res.status(404).send({ Message: 'Collection not Found' });
        if (Response == null || Response == undefined) return res.status(200).send({ Message: 'No Collections registered' });
        return res.status(200).send({ Message: 'Query Succeful', Usuarios: Response });
    })
}

// UPDATE
function Update(req, res) {
    const Id = req.params.id;
    req.body.Updated.By = req.usuario.id;
    req.body.Updated.At = Moment().unix();
    const Update = req.body;
    if (Update.Password && Update.Password != '') {
        Bcrypt.hash(Update.Password, null, null, (error, CryptedPassword) => {
            Update.Password = CryptedPassword;
            if (error) return res.status(500).send({ Message: 'Error while crypt Password for Usuario' });
            Usuario.findByIdAndUpdate(Id, Update, { new: true }, (Error, Updated) => {
                if (Error) return res.status(500).send({ Message: 'Error during Usuario Update!!', Error });
                if (!Updated || Updated == null) return res.status(404).send({ Message: 'Error during Usuario Update!!!, Server does not response' });
                return res.status(200).send({ Message: 'Usuario Updated succeful!', Usuario: Updated });
            });
        })
    } else {
        Update.Password = undefined;
        Usuario.findByIdAndUpdate(Id, Update, { new: true }, (Error, Updated) => {
            if (Error) return res.status(500).send({ Message: 'Error during Usuario Update!!', Error });
            if (!Updated || Updated == null) return res.status(404).send({ Message: 'Error during Usuario Update!!!, Server does not response' });
            return res.status(200).send({ Message: 'Usuario Updated succeful!', Usuario: Updated });
        });
    }
    // new: true hace que envie los datos despues de actualizar y no el estado anterior
}

// DELETE
function Delete(req, res) {
    const Id = req.params.id;
    req.body.Updated.By = req.usuario.id;
    req.body.Updated.At = Moment().unix();
    // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

    // new: true hace que envie los datos despues de actualizar y no el estado anterior
    Usuario.findByIdAndUpdate(Id, req.body, { new: true }, (Error, Updated) => {
        if (Error) return res.status(500).send({ Message: 'Error during Usuario Delete!!', Error });
        if (!Updated || Updated == null) return res.status(404).send({ Message: 'Error during Usuario Delete!!!, Server does not response' });
        return res.status(200).send({ Message: 'Usuario Deleted succeful!', Usuario: Updated });
    });
}

function changePassword(req,res) {
    const Update = req.body;
    const Id = Update._id;
    if (Update.oldPassword && Update.oldPassword != '' && Update.newPassword && Update.newPassword != '' ) {
        Usuario.findById(Id).exec((error, usuario) => {
            if (error) return res.status(404).send({Message: 'No se Encontro el Usuario'});
            Bcrypt.compare(Update.oldPassword, usuario.Password, (ErrorPassword, check) => {
                if (ErrorPassword) return res.status(500).send({ Message: 'Error while comparing passwords!!', ErrorPassword });
                if (check) {
                    Bcrypt.hash(Update.newPassword, null, null, (error, CryptedPassword) => {
                        usuario.Password = CryptedPassword;
                        if (error) return res.status(500).send({ Message: 'Error while crypt Password for Usuario' });
                        Usuario.findByIdAndUpdate(Id, usuario, { new: true }, (Error, Updated) => {
                            if (Error) return res.status(500).send({ Message: 'Error during Usuario Update!!', Error });
                            if (!Updated || Updated == null) return res.status(404).send({ Message: 'Error during Usuario Update!!!, Server does not response' });
                            return res.status(200).send({ Message: 'Usuario Updated succeful!', Usuario: Updated });
                        });
                    })
                }
            })
        })
    } else {   
        return res.status(404).send({ Message: 'Error during Usuario password change!!' });
    }
}

// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete,
    Login,
    ReadMotorizados,
    changePassword
}
