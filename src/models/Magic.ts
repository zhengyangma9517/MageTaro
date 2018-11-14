import { JustDetective } from 'justtools';

/**
 * data
 * toExecuteFunction (async)
 */
export interface IMagicParams {
    data?: any ; // to operate data
    toExecuteFunction: any ; // to execute function
}

/**
 * id
 * parameters
 */
export interface IMagic {
    id: string; // name of the Magic
    parameters: IMagicParams;
}

export class  Magic {
    private parameters: IMagicParams;

    /**
     * Magic Constructor
     * @param magic instance { id, level, parameter { data, toExecuteFunction } }
     */
    constructor( magic: IMagic ) {
        JustDetective.detect(magic, ( arcan: any ) => {}, '/Magic/constructor/magic' );
        this.parameters = magic.parameters;
    }
    public async execute(): Promise<any> {
        return this.parameters.toExecuteFunction ? await this.parameters.toExecuteFunction(this.parameters.data) : this.parameters.data ;
    }
}
