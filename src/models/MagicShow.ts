import { IMagician, MagicianLevel, MagicianStatus, Magician } from './Magician';
import { IMagicLink } from './MagicLink';
import { JustDetective } from 'justtools';

/**
 *  StandBy = 'standby',
    Complete = 'completed',
    Failded = 'failed',
    Skipped = 'skipped',
    ToSkip = 'toskip',
    Showing = 'showing'
 */
export enum MagciShowStatus {
    StandBy = 'standby',
    Complete = 'completed',
    Failded = 'failed',
    Skipped = 'skipped',
    ToSkip = 'toskip',
    Showing = 'showing'
}

/**
 * MagicShow format
 * id
 * magician
 * style
 * chapter
 * input
 * output
 * error
 * onError
 * status
 * isShowTime
 */
export interface IMagicShow {
    id: string;
    magician?: IMagician;
    style: string;
    chapter?: number;
    input?: any;
    output?: any;
    error?: TypeError | Error;
    onError?: any;
    status?: MagciShowStatus;
    itsShowTime?: any;
    inOneWord?: string;
}

/**
 * MagicShow Class
 */
export class MagicShow {
    /**
     * Magic Show Unique(Not global) Identifier
     */
    public readonly id: string;
    /**
     * Magician
     */
    public readonly magician: Magician | null = null;
    public readonly style: string;
    /**
     * the location on Magic Stage
     */
    public chapter: number;
    /**
     * Status
     */
    public status: MagciShowStatus;

    /**
     * input from previous show
     */
    private input: any;

    /**
     * output to next show
     */
    private output: any;

    /**
     * onError Processor
     */
    public onError: any;

    /**
     * Error Occurs
     */
    public error: any;

    /**
     * description
     */
    public inOneWord: string | null;

    /**
     * constructor function
     * @param id uniqueID
     * @param style magicShow Style
     * @param magician Magician
     * @param chapter On Stage
     */
    constructor( id: string , style: string, magician?: IMagician , chapter?: number,  inOneWord?: string) {
        this.id = id;
        this.style = style;
        this.inOneWord = inOneWord || null;
        if ( JustDetective.simpleDetect(magician) ) {
            this.magician = new Magician(magician);
        }
        this.chapter = chapter ||  -1 ;
        this.status = MagciShowStatus.StandBy;
    }

    /**
     * set Input Function
     * @param input
     */
    public setInput( input: any )  {
        this.input = input;
    }

    /**
     * get Output Function
     */
    public getOutput() {
        return this.output;
    }

        /**
     * get Input Function
     */
    public getInput() {
        return this.input;
    }

    /**
     * clear Memory allocation function
     */
    public async clearCache() {
        this.output = [];
        this.input = [];
    }

    /**
     * clear Input allocation function
     */
    public async clearInput() {
        this.input = [];
    }

    /**
     * clear Output allocation function
     */
    public async clearOutput() {
        this.output = [];
    }

    /**
     * change magic show status
     * @param status
     */
    public async setStatus( status: MagciShowStatus ) {
        this.status = status;
    }

    /**
     * Main processing function, It's showtime!
     */
    public async itsShowTime(): Promise<any> {
        if ( this.status === MagciShowStatus.ToSkip ) {
            await this.clearCache();
            await this.setStatus( MagciShowStatus.Skipped );
            this.output = 'Skipped';
            return;
        }
        this.magician!.magic!.data = this.input || [];
        // start magcishow
        await this.magician!.prepareMagic();
        let superise  = await this.magician!.playmagic();
        // error processor
        if (superise instanceof TypeError || superise instanceof Error) {
            this.error = superise;
            superise = JustDetective.simpleDetect(this.onError) ? this.onError(superise) : superise;
            await console.error( 'Error on magicshow: ' + this.id + 'Message: ' + superise);
            await this.setStatus(MagciShowStatus.Failded);
            this.output = superise;
            return;
        }
        // output, change status into complete
        await this.setStatus( MagciShowStatus.Complete );
        this.output = superise;
        return;
    }
}
