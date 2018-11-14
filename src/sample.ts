async function main() {
    // // magiclink test
    // const links: IMagicLink[] = [
    //     magicLink('A->B'),
    //     magicLink('B->D', { condition: ( input: any[] ) => { return input; } } ),
    //     magicLink('A->C'),
    //     magicLink('C->D')
    // ];
    // const shows = getShowsFromLinks(links);
    // const mmatrix = magicMatrix( shows , links);
    // const relations = magicGraph( shows, mmatrix, true );
    // const newlinks = relations.map( ( relation: any ) => relationToMlink(relation));
    // console.log(relations);
    // console.log(newlinks);
    // mMatrixPrint( shows, mmatrix, true );

    // magicshow test
    // const debutShow: IMagicShow = {
    //     id: 'DebutShow',
    //     style: 'Debut',
    //     magician: {
    //         magic: {
    //             toExecuteFunction: async ( input: any ) => { await console.log('Enjoy your debut show.'); return input; }
    //         }
    //     },
    // };
    // const debut: MagicShow = MagicShowFactory(debutShow);
    // debut.setInput('Debut Success!');
    // await debut.itsShowTime();
    // await console.log(debut.getOutput());

    // const mongoShow: IMagicShow = {
    //     id: 'MongoShow',
    //     style: SpellStyle.MongoMagic,
    // };
    // const mongo: MagicShow = MagicShowFactory(mongoShow);
    // const request: IMongoParams = {
    //     option: MongoOption.Find,
    //     query: {},
    //     collectname: 'zytest',
    //     credentials: {
    //         url: 'mongodb://uat_devuser:3pPjHtSJYUbM3NdF@dds-rj9d86ae59a0dc541430-pub.mongodb.rds.aliyuncs.com:3717,dds-rj9d86ae59a0dc542861-pub.mongo' +
    //         'db.rds.aliyuncs.com:3717/uat-dev?replicaSet=mgset-5440607',
    //         database: 'uat-dev'
    //     }
    // };
    // mongo.setInput(request);
    // await mongo.itsShowTime();
    // await console.log( mongo.getOutput() );
}
