export class Usuario {
    constructor(
        public _id          : string,
        // public Account      : string,
        public Password     : string,
        public Email        : string,
        public Persona      : string,
        public Role         : string,
        public Empresa      : string,
        public Bodega       : string,
        public Repartidor   : boolean,
        public  RepData     : {
            Placa           : string,
            Tipo            : string
        },
        public Active       : boolean,
        public Created      : {
            By              : string,
            At              : string
        },
        public Updated      : {
            By              : string,
            At              : string
        }
    ) {}
}
