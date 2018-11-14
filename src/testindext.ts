export * from './models/MagicMatrix';
export * from './models/MagicLink';
export * from './models/Magician';
export * from './models/MagicShow';
export * from './models/Magic';
export * from './shows/Geo.MagicShow';
export * from './shows/Mongo.MagicShow';
export * from './shows/Mysql.MagicShow';
export * from './utils/Configurations';
export * from './utils/Logger';
export * from './utils/Interfaces';
export * from './utils/MagicshowFactory';

import { magicMatrix, magicGraph, mMatrixPrint } from './models/MagicMatrix';
import {IMagicLink,  magicLink, relationToMlink, magicChapters} from './models/MagicLink';
import { MagicStageFactory, MagicStage } from './models/MagicStage';
import { IMagicShow, MagicShow } from './models/MagicShow';
import { MagicShowFactory, SpellStyle } from './utils/MagicshowFactory';
import { IMongoParams, MongoOption } from './shows/Mongo.MagicShow';
import { IMysqlParams } from './shows/Mysql.MagicShow';
import { Magician } from './models/Magician';
import { JustDetective } from 'justtools';

const ClASSES = [ 'BlackMage', 'RedMage', 'WhiteMage', 'AzureMage' ];

const shows: IMagicShow[] = ClASSES.map( i => ({
        id: i,
        style: SpellStyle.Fireball,
        magician: {
            magic: {
                toExecuteFunction: async ( input: any ) => {
                    const cooldown = new Promise((resolve, reject) => {
                        setTimeout(function() { resolve('COOLDOWN OVER'); } , 5000);
                       });
                    const wait = await cooldown;
                    console.log(i);
                    return i; }
            }}
        }));

async function main() {
    // // magiclink test
    // const links: IMagicLink[] = [
    //     magicLink('A->B'),
    //     magicLink('B->D', { condition: ( input: any[] ) => { return input; } } ),
    //     magicLink('A->C'),
    //     magicLink('C->D')
    // ];
    // const chapters = magicChapters(links, 'A', 'D');
    // const mmatrix = magicMatrix( chapters , links);
    // const relations = magicGraph( chapters, mmatrix, true );
    // const newlinks = relations.map( ( relation: any ) => relationToMlink(relation));
    // console.log(chapters);
    // console.log(relations);
    // console.log(newlinks);
    // mMatrixPrint( chapters, mmatrix, true );

    // magicshow test
    // debut.setInput('Debut Success!');
    // await debut.itsShowTime();
    // await console.log(debut.spots);

    const stage: MagicStage = MagicStageFactory(
        {
            magicLinks: [
                magicLink('BlackMage -> RedMage'),
                magicLink('RedMage -> WhiteMage'),
                magicLink('BlackMage -> AzureMage'),
                magicLink('AzureMage -> WhiteMage')
            ],
            magicShows: shows,
            prologue: 'BlackMage',
            epilogue: 'WhiteMage'
        }
    );
    await console.log(stage);
    stage.displayMatrix();
    await stage.enjoyTheShow();
}

main();
