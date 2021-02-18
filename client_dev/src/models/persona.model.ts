export class Persona {
    constructor(
        public _id          : string,
        public Ci           : string,
        public FirstName    : string,
        public LastName     : string,
        public Phone        : string,
        // public City         : string,
        public Address      : string,
        public GPS          : string,
        public Active       : boolean,
        public isDueno      : boolean,
        public HasAccount   : boolean,
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
