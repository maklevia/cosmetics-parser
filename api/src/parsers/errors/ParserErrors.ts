import { StoreName } from "@api/types/StoreName.js";

export class InvalidLinkError extends Error {
    constructor(message: string = 'Provided link is invalid!') {
        super(message);
        this.name = 'InvalidLinkError'
    }
};

export class StoreRequestError extends Error {
    constructor(storeName: StoreName, message: string = 'Error parsing product from') {
        super(message = `${message} ${storeName}`);
        this.name = 'StoreRequestError';
    }
}

export class ParserError extends Error {
    constructor(message: string = 'Parser error') {
        super(message);
        this.name = 'ParserError'
    }
}