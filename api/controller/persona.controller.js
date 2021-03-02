'use strict'

const Persona = require('../model/persona.model');
const Moment = require('moment');
const Pagination = require('../services/pagination');
// funciones
    // CREATE
    function Create(req, res) {
        const params = req.body;
        const persona = new Persona();
        let noFN = "", noLN = "", noPh = "", noCity = "", noAddress = "";
        if (!params.FirstName) noFN = "[First Name]"; if (!params.LastName) noLN = "[Last Name]"; if (!params.Phone) noPh = "[Phone]";
        if (!params.City) noCity = "[City]"; if (!params.Address) noAddress = "[Address]";
        console.log(params.City);
        if(params.FirstName && params.LastName && params.Phone && params.Address ){
            persona.Ci          = params.Ci          ;   
            persona.FirstName   = params.FirstName   ;
            persona.LastName    = params.LastName    ;
            persona.Phone       = params.Phone       ; 
            // persona.City        = params.City        ; 
            persona.Address     = params.Address     ;
            persona.GPS     = params.GPS     ;
            persona.HasAccount  = params.HasAccount  ;
            persona.isDueno     = params.isDueno     ;
            if (req.usuario) {
                persona.Created.By = req.usuario.id    ;
            } 

            persona.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Persona'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Persona Saved!', Persona: stored});
                } else return res.status(404).send({Message: 'Error: Persona Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating Persona, Required Fields: ' + noFN + ' ' + noLN + ' ' + noPh + ' ' + noCity + ' ' + noAddress
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Persona.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Persona.find()
        Query.populate({
            path: 'Created.By Updated.By City',
            populate: {
                path: 'Persona Canton',
                populate: {
                    path: 'Provincia'
                }
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', Personas: Response});
        })
    }

    
    async function Find(Query, Filters) {
        const Raw = await Query.sort('_id').exec();
        let Filtered = [];
        for (const item of Raw) {
            const nombre = item.FirstName.toLowerCase().replace(/[^\w]/gi, '');
            const apellido = item.LastName.toLowerCase().replace(/[^\w]/gi, '');
            const telefono = item.Phone.replace(/[^\w]/gi, '');
            const cedula = item.Ci.replace(/[^\w]/gi, '');
            let direccion = item.Address.toLowerCase().replace(/[^\w]/gi, '');

            let myAddress = JSON.parse(item.GPS);
            
            if (myAddress && myAddress.address_components.length >=1 ) {
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
                case 'name':
                    termino = nombre;
                    break;
                  case 'ci':
                    termino = cedula;
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
                    termino = nombre + apellido + telefono + direccion + cedula;
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
        const Active     = req.params.active;
        let Query        = Persona.find({Active});
        const PaginationData = req.body.PaginationData;
        const Filters = req.body.Filters;
        if (!Active || (Active != 'true' && Active != 'false')) Query = Persona.find();
        if (!Filters.searchText || Filters.searchText == null || Filters.searchText == undefined) Filters.searchText = '';

        Find(Query, Filters).then((Array) => {
            let Raw = [];
            if (PaginationData.raw && PaginationData.raw == true) Raw = Array;
            return res.status(200).send({
                Message: 'Query Succeful', 
                Personas: Pagination.paginate(Array, PaginationData),
                Raw
            })
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        var Update =req.body;
        Update.Updated.By = req.usuario.id;
        Update.Updated.At = Moment().unix();

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Persona.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Persona Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Persona Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Persona Updated succeful!', Persona: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Persona.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Persona Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Persona Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Persona Deleted succeful!', Persona: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete,
    ComplexRead
}