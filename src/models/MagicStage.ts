import { IMagicLink, magicChapters } from './MagicLink';
import { magicMatrix, mMatrixPrint } from './MagicMatrix';
import { IMagicShow, MagicShow, MagciShowStatus} from './MagicShow';
import { MagicShowFactory } from '../utils/MagicshowFactory';
import { JustDetective } from 'justtools';

export interface IMagicStage {
    magicLinks: IMagicLink[];
    magicShows: IMagicShow[];
    prologue: string;
    epilogue: string;
}

export class MagicStage {
    private magicLinks: IMagicLink[];
    private magicShows: MagicShow[];
    private magicMatrix: any[];
    private prologue: string;
    private epilogue: string;
    private chapters: string[];

    /**
     *
     * @param magicLinks
     * @param magicShows
     * @param prologue
     * @param epilogue
     */
    constructor( magicLinks: IMagicLink[], magicShows: IMagicShow[], prologue: string, epilogue: string ) {
        this.magicLinks = magicLinks;
        this.magicShows = magicShows.map( magicShow => (MagicShowFactory(magicShow)) );
        this.prologue = prologue;
        this.epilogue = epilogue;
        this.chapters = magicChapters(magicLinks, prologue, epilogue);
        this.magicMatrix = magicMatrix(this.chapters, magicLinks);
        this.bindChapters();
    }

    /**
     * bind chapters codes with magic shows
     */
    private bindChapters() {
        for ( let i = 0 ; i < this.magicShows.length; i ++ ) {
            this.magicShows[i].chapter = this.chapters.indexOf(this.magicShows[i].id);
        }
        this.magicShows = this.magicShows.sort( ( a: any, b: any ) => { return ( a.chapter - b.chapter ); } );
    }

    /**
     * pretty pint the generated matrix
     */
    public displayMatrix() {
        mMatrixPrint(this.chapters, this.magicMatrix, true);
    }

    /**
     * Show time man.
     */
    public async enjoyTheShow() {
        let enjoying: Boolean = true;
        const prologue = await this.magicShows[0].itsShowTime();
        while (enjoying) {
            const perfectTiming: MagicShow[] = [];
            this.magicShows.map( ( thishow: MagicShow ) => {
                // calculating if the show is allowed to be performed.
                let input: any = [];
                let sum1 = 0; // total parents
                let sum2 = 0; // total completed parents
                for ( let row = 0; row <  this.chapters.length; row ++ ) {
                    sum1 = this.magicMatrix[row][thishow.chapter] !== 0 ? sum1 + 1 : sum1;
                }
                for ( let row = 0; row < this.chapters.length; row ++ ) {
                    if (this.magicMatrix[row][thishow.chapter] !== 0 && this.magicShows[row].status === MagciShowStatus.Complete ) {
                        // if it is the parent show
                        if ( JustDetective.simpleDetect( this.magicMatrix[row][thishow.chapter] ) ) {
                            /**
                             * condition check , if skip this producers
                             */
                            if ( JustDetective.simpleDetect( this.magicMatrix[row][thishow.chapter].condition ) ) {
                                const goodToGO = this.magicMatrix[row][thishow.chapter].condition( this.magicShows[row].getOutput() );
                                thishow.status = goodToGO ? thishow.status : MagciShowStatus.ToSkip;
                            }
                        }
                        sum2 = sum2 + 1;
                    }
                }
                if ( sum1 === sum2 && sum2 > 1 ) { // mutiple parents
                    for ( let row = 0; row < this.chapters.length; row ++ ) {
                        if (this.magicMatrix[row][thishow.chapter] !== 0 ) {
                            input.push( this.magicShows[row].getOutput() );
                        }
                    }
                    thishow.setInput(input);
                    perfectTiming.push( thishow );
                }
                if (sum1 === sum2 && sum2 === 1 ) {// Single parents
                    for ( let row = 0; row < this.chapters.length; row ++ ) {
                        if (this.magicMatrix[row][thishow.chapter] !== 0 ) {
                            input = this.magicShows[row].getOutput();
                        }
                    }
                    thishow.setInput(input);
                    perfectTiming.push( thishow );
                }
            } );
            // show time !
            const promises: any[] = [];
            perfectTiming.map( ( show: MagicShow ) => {
                promises.push( new Promise( async ( resolve, reject ) => {
                    resolve( await show.itsShowTime() );
                } ) );
            } );
            await Promise.all(promises);

            // Completed change the matrix status
            this.magicShows.map( (magicshow: MagicShow) => {
                if ( magicshow.status === MagciShowStatus.Complete || magicshow.status === MagciShowStatus.Failded || magicshow.status === MagciShowStatus.Skipped ) {
                    for ( let row = 0 ; row <  this.chapters.length; row ++ ) {
                        if ( this.magicMatrix[row][magicshow.chapter] !== 0 ) {
                            this.magicMatrix[row][magicshow.chapter] = 0; // completed
                            this.magicShows[row].clearCache();
                        }
                    }
                }
                if ( magicshow.status === MagciShowStatus.Failded || magicshow.status ===  MagciShowStatus.Skipped ) {
                    for ( let col = 0 ; col <  this.chapters.length; col ++ ) {
                        if (this.magicMatrix[magicshow.chapter][col] !== 0 ) {
                            this.magicShows.map( ( mageshow: MagicShow ) => {
                                if ( mageshow.chapter === col ) {
                                    mageshow.setStatus(MagciShowStatus.ToSkip);
                                }
                            } );
                        }
                    }
                }
            });
            // ending condition
            let magicSum = 0;
            for ( let col = 0 ; col < this.magicMatrix.length; col ++ ) {
                for ( let row = 0; row < this.magicMatrix.length; row ++ ) {
                    magicSum += this.magicMatrix[col][row];
                }
            }
            enjoying = magicSum === 0 ? false : true;
        }
    }
}

export function MagicStageFactory( stage: IMagicStage ): MagicStage {
    return new MagicStage(stage.magicLinks, stage.magicShows, stage.prologue, stage.epilogue);
}
