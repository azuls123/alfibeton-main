export class Empresa {
    constructor(
        public _id          : string,
        public RUC          : string,
        public Address      : string,
        // public City         : string,
        public Name         : string,
        public GPS           : string,
        public Admin        : string,
        public Representante: string,
        public Active       : boolean
    ) {}
}
