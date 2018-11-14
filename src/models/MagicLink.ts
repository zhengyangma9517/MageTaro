import { JustDetective } from 'justtools';
import {uniq} from 'lodash';

export interface IMagicWeight {
    value?: any;
    condition?: any;
    injection?: any;
}

export interface IMagicLink {
    start: string;
    end: string;
    w: IMagicWeight | null;
}

/**
 *
 * @param relation string: A->B
 * @param w(weights): condition?, injection?
 */
export function magicLink( relation: string,  w?: IMagicWeight ): IMagicLink {
    relation = relation.replace(/ /g, '');
    const regx = /[a-zA-Z0-9]*->[a-zA-Z0-9]*/;
    if ( JustDetective.isMatchRegex( relation, regx ) ) {
        const startend = relation.split('->');
        const start = startend[0];
        const end = startend[1];
        return { start: start, end: end, w: w ?
            JustDetective.simpleDetect(w.value) ? w : { value: 1, condition: w.condition, injection: w.injection }
            : { value: 1 } };
    } else {
        console.error( new TypeError('Link relation should be in format A->B: ' + relation) );
        process.exit(1);
        return { start: 'muggle', end: 'muggle', w: null };
    }
}

/**
 *
 * @param relation
 */
export function relationToMlink( relation: any ) {
    const mLink: IMagicLink = {
        start: relation.from,
        end: relation.to,
        w : { value: 1 }
    };
    if ( JustDetective.simpleDetect( relation.condition ) ) {
        mLink.w!.condition = relation.condition;
    }
    if ( JustDetective.simpleDetect( relation.inject ) ) {
        mLink.w!.injection = relation.inject;
    }
    return mLink;
}

/**
 *
 * @param link
 */
export function mLinkToRelation( link: IMagicLink ) {
    const relation: any = {
        from: link.start,
        to: link.end,
    };
    if ( JustDetective.simpleDetect(link.w) ) {
        if ( JustDetective.simpleDetect(link.w!.condition) ) {
            relation.condition = link.w!.condition;
        }
        if ( JustDetective.simpleDetect(link.w!.injection) ) {
            relation.injection = link.w!.injection;
        }
    }
    return relation;
}

/**
 *
 * @param links
 */
export function getShowsFromLinks( links: IMagicLink[] ): string[] {
    const shows: any[] = [];
    links.map( ( link: IMagicLink ) => {
        shows.push( link.start );
        shows.push( link.end );
    } );
    return uniq(shows);
}

/**
 *
 * @param links
 * @param prologue
 * @param epilogue
 */
export function magicChapters( links: IMagicLink[], prologue: string, epilogue: string ): string[] {
    let chapters: string[] = [];
    links.map( ( link: IMagicLink ) => {
        chapters.push( link.start );
        chapters.push( link.end );
    } );
    chapters = uniq(chapters);
    chapters.splice(chapters.indexOf(prologue), 1);
    chapters.splice(chapters.indexOf(epilogue), 1);
    chapters = [ prologue ].concat(chapters).concat([epilogue]);
    return uniq(chapters);
}
