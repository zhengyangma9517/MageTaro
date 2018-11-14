import { IMagicParams} from './Magic';
import { JustDetective } from 'justtools';

/**
 * great means the magician is of value, ready for the show
 * muggle means the magician is of no value, not ready for the show
 */
export enum MagicianStatus {
    GreatShowman = 'great',
    Muggle = 'muggle',
    Unknown = 'unknown'
}

/**
 * id?, level, magic, status?, playmagic?
 */
export interface IMagician {
    id?: string;
    level?: MagicianLevel;
    magic: IMagicParams;
    status?: MagicianStatus;
    playmagic?: any;
    prepareMagic?: any;
    setMagic?: any;
    description?: string;
}

export enum MagicianLevel {
    Senior = 'senior', // Major magician
    Junior = 'junior' // Sub magician
}

export class Magician {
    public magic: IMagicParams | null;
    public readonly id: string;
    public readonly level: MagicianLevel;
    public status: MagicianStatus  = MagicianStatus.Unknown;
    public playmagic: any;

    /**
     * Magician Constructor
     * @param magician IMagician if exsists using magician as initiation.
     * @param id default NoName
     * @param magic
     * @param playmagic
     */
    public constructor( magician?: IMagician, id?: string , magic?: IMagicParams , level = MagicianLevel.Senior) {
        if ( JustDetective.simpleDetect(magician) ) {
            this.id = JustDetective.simpleDetect(magician!.id) ? magician!.id! : 'NoName' ;
            this.magic = magician!.magic;
            this.level = magician!.level! || level;
        } else {
            this.id = id! || 'NoName';
            this.level = level;
            this.magic = JustDetective.simpleDetect(magic) ? magic! : null;
        }
    }

    /**
     *
     * @param magic
     */
    public setMagic( magic: IMagicParams ) {
        if ( JustDetective.simpleDetect(magic) ) {
            this.magic = magic;
        } else {
            this.magic = null;
            console.warn( 'Invalid magic structure for the Magician: ' + this.id);
        }
    }

    /**
     * prepareMagic function
     * @param magic optional
     */
    public async prepareMagic( magic?: IMagicParams ): Promise<any> {
        const preparingMagic: IMagicParams | null = magic ? magic : (this.magic ?  this.magic : null );
        if ( !JustDetective.simpleDetect(preparingMagic) ) {
            this.playmagic = async () => {};
            this.status = MagicianStatus.Muggle;
            return MagicianStatus.Muggle;
        } else if ( !JustDetective.simpleDetect(preparingMagic!.data) || !JustDetective.simpleDetect(preparingMagic!.toExecuteFunction) ) {
            this.playmagic = async () => {};
            this.status = MagicianStatus.Muggle;
            return MagicianStatus.Muggle;
        } else {
            this.playmagic = async (): Promise<any> =>  {
                return preparingMagic!.toExecuteFunction ? await preparingMagic!.toExecuteFunction(preparingMagic!.data)
                : preparingMagic!.data ;
            };
            this.status = MagicianStatus.Muggle;
            return MagicianStatus.GreatShowman;
        }
    }
}
