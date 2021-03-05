'use strict'

const Usuario = require('../model/usuario.model');
const Bcrypt = require('bcrypt-nodejs');
const JWT = require('../services/jwt');
const Moment = require('moment');
const Pagination = require('../services/pagination');
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
        if (Error) return res.status(500).send({ Message: 'Error al intentar Iniciar Sesión', Error });
        //  console.log(usuario);
        if (usuario) {
            console.log(Password, usuario.Password);
            Bcrypt.compare(Password, usuario.Password, (ErrorPassword, check) => {
                if (ErrorPassword) return res.status(500).send({ Message: 'Error al Comparar las Contraseñas!!', ErrorPassword });
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
                    return res.status(401).send({ Message: 'Contraseña Incorrecta' });
                }
            });
        } else {
            return res.status(404).send({ Message: 'Error en el correo electrónico, o no existe' });
        }
    });
}

async function Find(Query, Filters) {
    const Raw = await Query.sort('_id').exec();
    let Filtered = [];
    for (const item of Raw) {
        const nombre = item.Persona.FirstName.toLowerCase().replace(/[^\w]/gi, '');
        const apellido = item.Persona.LastName.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = item.Persona.Phone.replace(/[^\w]/gi, '');
        const cedula = item.Persona.Ci.replace(/[^\w]/gi, '');
        let direccion = item.Persona.Address.toLowerCase().replace(/[^\w]/gi, '');

        const rol = item.Role.toLowerCase().replace(/[^\w]/gi, '');
        const mail = item.Email.toLowerCase().replace(/[^\w]/gi, '');

        let myAddress = JSON.parse(item.Persona.GPS);

        if (myAddress && myAddress.address_components.length >= 1) {
            direccion = direccion + myAddress.address_components[0].long_name;
            direccion = direccion + myAddress.address_components[1].long_name;
            direccion = direccion + myAddress.address_components[2].long_name;
            direccion = direccion + myAddress.address_components[3].long_name;
            if (myAddress.address_components[4]) direccion = direccion + myAddress.address_components[4].long_name;
            if (myAddress.address_components[5]) direccion = direccion + myAddress.address_components[5].long_name;
            if (myAddress.address_components[6]) direccion = direccion + myAddress.address_components[6].long_name;
        }

        let termino = '';

        switch (Filters.type.toLowerCase()) {
            case 'role':
                termino = rol;
                break;
            case 'mail':
                termino = mail;
                break;
            case 'ci':
                termino = cedula;
                break;
            case 'name':
                termino = nombre;
                break;
            case 'lastname':
                termino = apellido;
                break;
            case 'phone':
                termino = telefono;
                break;
            case 'address':
                termino = direccion;
                break;
            default:
                termino = nombre + apellido + telefono + direccion + cedula + mail + rol;
                break;
        }

        if (termino.indexOf(Filters.searchText.toLowerCase().replace(/[^\w]/gi, '')) > -1) {
            Filtered.push(item);
        }
    }
    return Filtered;

}

// COMPLEX READ
function ComplexRead(req, res) {
    const Active = req.params.active;
    let Query = Usuario.find({ Active });
    const PaginationData = req.body.PaginationData;
    const Filters = req.body.Filters;
    if (!Active || (Active != 'true' && Active != 'false')) Query = Usuario.find();
    if (!Filters.searchText || Filters.searchText == null || Filters.searchText == undefined) Filters.searchText = '';
    Query = Query.populate({
        path: 'Persona Empresa Bodega Created.By Updated.By',
        populate: {
            path: 'Representante Admin Persona By',
            populate: {
                path: 'Persona'
            }
        }
    });
    Find(Query, Filters).then((Array) => {
        let Raw = [];
        if (PaginationData.raw && PaginationData.raw == true) Raw = Array;
        return res.status(200).send({
            Message: 'Query Succeful',
            Usuarios: Pagination.paginate(Array, PaginationData),
            Raw
        })
    })
}

// READ
function Read(req, res) {
    const Active = req.params.active;
    let Query = Usuario.find({ Active }, { Password: 0 });

    if (!Active || (Active != 'true' && Active != 'false')) Query = Usuario.find({}, { Password: 0 })
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
    Usuario.find({ Empresa, Role: 'Motorizado' }).populate({
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
    // borrar el password
    delete Update.Password;
    Usuario.findByIdAndUpdate(Id, Update, { new: true }, (Error, Updated) => {
        if (Error) return res.status(500).send({ Message: 'Error during Usuario Update!!', Error });
        if (!Updated || Updated == null) return res.status(404).send({ Message: 'Error during Usuario Update!!!, Server does not response' });
        return res.status(200).send({ Message: 'Usuario Updated succeful!', Usuario: Updated });
    });
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

function changePassword(req, res) {
    const Update = req.body;
    const Id = Update._id;
    if (Update.oldPassword && Update.oldPassword != '' && Update.newPassword && Update.newPassword != '') {
        Usuario.findById(Id).exec((error, usuario) => {
            if (error) return res.status(404).send({ Message: 'No se Encontro el Usuario' });
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
    changePassword,
    ComplexRead
}
