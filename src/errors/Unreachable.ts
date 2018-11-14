
/**
 * Unreachable Magicians.
 */
export class Unreachable extends Error {
    public constructor( message?: string ) {
        super(message);
        this.name = 'Unreachable Magic Show.';
    }
}
