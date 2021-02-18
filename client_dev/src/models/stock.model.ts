export class Stock {
    constructor(
        public _id          : string,
        public Units        : number,
        public Ins          : number,
        public Moved        : number,
        public Outs         : number,
        public TotalProx    : number,
        public TotalReal    : number,
        public Bodega       : string,
        public Variante     : string,
        // public Active       : string
    ) {}
}
