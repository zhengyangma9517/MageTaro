
/**
 * Invalid Input Format
 */
export class InvalidFormat extends Error {
    constructor( message?: string ) {
        super(message);
        this.name = 'Invalid Format.';
    }
}
