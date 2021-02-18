export class Ingreso {
    constructor(
        public _id              : string,
        public Number           : number,
        public Bodega           : string,
        public BodegaTraslado   : string,
        public SuggestedDate    : string,
        public SuggestedTime    : string,
        public Estado           : string,
        public Received     : {
            By      : string,
            At      : string
        },
        public Active           : boolean
    ) {}
}
