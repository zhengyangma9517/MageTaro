import { prettySpaces, prettyMatrixPrint } from 'justtools';
import {IMagicLink, mLinkToRelation} from './MagicLink';
import {cloneDeep} from 'lodash';
import { Unreachable } from '../errors/Unreachable';
import { InvalidFormat } from '../errors/InvalidFormat';

/**
 * convert mlinks to magic matrix
 * @param magicshows
 * @param magiclinks
 * @param complexMode default false
 */
export function magicMatrix ( magicshows: string[], magiclinks: IMagicLink[], complexMode = false): any[] {
    const matrix: any[] = [];
    for ( let i = 0;  i < magicshows.length; i++) {
        matrix.push([]);
        for ( let j = 0; j < magicshows.length; j++) {
            matrix[i][j] = 0;
        }
    }
    magiclinks.map( ( link: IMagicLink ) => {
        matrix[magicshows.indexOf(link.start)][magicshows.indexOf(link.end)] = complexMode ? link.w : 1;
    } );
    linkIsGood( matrix, magicshows );
    return matrix;
}

/**
 *
 * @param magicshows
 * @param magiclinks
 */
const linkIsGood = ( magicmatrix: any[], chapters: string[] ): Boolean | Error => {
    chapters.map( ( chapter: string ) => {
        const chapterNumber = chapters.indexOf(chapter);
        if ( chapterNumber > 0 ) {
            let sum = 0;
            for ( let i = 0 ; i < chapters.length; i ++ ) {
                sum += magicmatrix[i][chapterNumber];
            }
            if ( sum === 0 ) {
                console.error(new Unreachable('Unreachable Magic Show: ' + chapter));
                process.exit(-1);
            }
        }
    } );
    return true;
};

/**
 * convert magicmatrix to magiclinks or relations
 * @param magicshows
 * @param magicmatrix
 * @param relationMode default false
 */
export function magicGraph( magicshows: string[], magicmatrix: any[] , relationMode = false) {
    let links: IMagicLink[] = [];
    linkIsGood( magicmatrix, magicshows );
    magicshows.map( (show: string) => {
        const i = magicshows.indexOf(show);
        for ( let j = 0; j < magicshows.length; j ++ ) {
            if ( magicmatrix[i][j] !== 0) {
                links.push( { start: magicshows[i], end: magicshows[j], w: magicmatrix[i][j] } );
            }
        }
    } );
    if ( relationMode ) {
        const relations: any[] = links.map( ( link: IMagicLink ) => mLinkToRelation(link) );
        links = [];
        return relations;
    }
    return links;
}

/**
 *
 * @param magicshows
 * @param magicmatrix
 * @param print optional
 */
export function mMatrixPrint( magicshows: string[], magicmatrix: any[], print = false ) {
    let toprint: any = cloneDeep(magicmatrix);
    const shows =  cloneDeep(magicshows);
    toprint = toprint.map( ( mm: any[] ) => {
        return [magicshows[toprint.indexOf(mm)]].concat(mm);
    } );
    const children: any = [' '].concat(shows);
    toprint = [children].concat(toprint);
    if (print) {
        prettyMatrixPrint(prettyFormat(toprint, 25));
    }
    return (toprint);
}

/**
 *
 * @param matrix
 * @param stringLenght
 */
const prettyFormat = ( matrix: any[] , stringLength = 15 ) => {
    matrix.map(
        ( row: any ) => {
            row.map((element: any) => {
                const newelement = typeof(element) !== 'string' && typeof(element) !== 'number' ? 'w' : String(element);
                matrix[ matrix.indexOf(row) ][ row.indexOf(element) ] = prettySpaces(newelement);
            });
        }
    );
    return matrix;
};
