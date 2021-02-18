export class ListaIngreso {
    constructor(
        public _id              : string,
        public Ingreso          : string,
        public ProductoVariante : string,
        public Units            : number,
        public Received         : string,
        public UnitsReceiveds   : number,
        public Active           : boolean
    ) {}
}
