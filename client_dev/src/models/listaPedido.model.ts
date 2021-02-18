export class ListaPedido {
    constructor(
        public _id                  : string,
        public Pedido               : string,
        public ProductoVariante     : string,
        public UnitsSell            : number,
        public UnitsFree            : number,
        public Units                : number,
        public UnitsProx            : number,
        public ValueByUnits         : number,
        public Discount             : number,
        public Percent              : number,
        public ValueIdeal           : number,
        public TotalDiscount        : number,
        public UnitsBack            : number,
        public OrderCode            : string,
        public Received            : string,
        public Delivered            : {
            By                      : string,
            At                      : string,
        },
        public FinalValue           : number,
        public FinalValueProx       : number,
    ) {}
}
