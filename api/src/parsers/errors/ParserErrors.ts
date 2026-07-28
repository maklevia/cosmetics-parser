import { StoreName } from "@api/types/Enums.js";

//on invalid link input
export class InvalidLinkError extends Error {
    constructor(message: string = 'Provided link is invalid!') {
        super(message);
        this.name = 'InvalidLinkError'
    }
};

//on store refused collection
export class StoreRequestError extends Error {
    constructor(storeName: StoreName, message: string = 'Error parsing product from') {
        super(message = `${message} ${storeName}`);
        this.name = 'StoreRequestError';
    }
}

//on psrser code error
export class ParserError extends Error {
    constructor(message: string = 'Parser error') {
        super(message);
        this.name = 'ParserError'
    }
}