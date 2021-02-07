'use strict'

const Message = require('../model/message.model');
const client = require('socket.io').listen(3000).sockets;
const Moment = require('moment');
// funciones
    function Create(req, res) {
        const params = req.body;
        const message = new Message();
        let noText = "", noTo = "";
        if (!params.Message) noText = "[Message]"; if (!params.To) noTo = "[To]";
        
        if(params.Message){
            message.Message             = params.Message            ;
            // message.To                  = params.To                 ;
            message.Created.By          = req.usuario.id            ;
            
            message.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Message'});
                if (stored && stored != null) {
                    // var socketIO = global.socketIO;
                    // socketIO.emit('MSJ:Send', message);
                    return res.status(201).send({Message: 'Message Saved!'});
                } else {
                    return res.status(404).send({Message: 'Error: Message Saved null'});
                }
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating Message, Required Fields: ' + ' ' + noVal + ' ' + noPed + ' ' + noStock
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Message.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Message.find()
        Query.populate({
            path: 'Created.By Updated.By To',
            populate: {
                path: 'Persona Role'
            }

        }).exec((Error, Response) => {
            client.on('connection', function (){
                sendStatus = function(s){
                    socket.emit('status',s);
                };
            })
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            socket.emit('output', Response);
            // if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        ListaPedido.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Message Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during ListaPedido Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Message Updated succeful!', Message: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        ListaPedido.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Message Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Message Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Message Deleted succeful!', Message: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete
}