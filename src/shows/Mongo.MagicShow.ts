import { MagicShow} from '../models/MagicShow';
import { IMagician } from '../models/Magician';
import { JustDetective } from 'justtools';
import {  MongoClient  } from 'mongodb';
import { SpellStyle } from '../utils/MagicshowFactory';

export enum MongoOption {
    Find = 'find',
    Bulk = 'bulk',
    Aggregate = 'aggregate',
    InsertMany = 'insertMany',
}


/**
 * option
 * query
 * collectionname
 * credentials
 * project?
 * limit?
 * skip?
 * documents?
*/
export interface IMongoParams {
    option: MongoOption;
    query: any;
    collectname: string;
    credentials: any;
    project?: any;
    limit?: number;
    skip?: number;
    documents?: any[];
    distinct?: any;
}

/**
 * params IMongoParams
 * return would be a array
 */
export class MongoMagicShow extends MagicShow {
    /**
     * Mongo Magic show allows Mongo Operations
     * @param id
     * @param style
     */
    constructor( id: string  ,  style = SpellStyle.MongoMagic, chapter?: number, inOneWord = 'Mongo Magician allows Mongo Operations') {
        const magician: IMagician = {
            magic: {
                toExecuteFunction: async( params: IMongoParams ) => {
                    JustDetective.detect(params, (d: any) => {} , `/MongoDataSource/dataa`);
                    const client = await MongoClient.connect(params.credentials.url, { useNewUrlParser: true } ).catch((err: any) => {  console.error( TypeError(err));  });
                    if (!client) { throw new TypeError('Cannot create mongo connection'); }
                    const mongo = client.db(params.credentials.database);
                    const collection = mongo.collection(params.collectname);
                    let result: any = [];
                    switch (params.option) {
                        case MongoOption.Find: {
                            let cursor: any = collection.find(params.query);
                            cursor = params.project ? cursor.project(params.project) : cursor;
                            cursor = params.limit ? cursor.limit(params.limit) : cursor;
                            cursor = params.skip ? cursor.skip(params.skip) : cursor;
                            cursor = params.distinct ? cursor.distinct(params.distinct) : cursor;
                            result = await cursor.toArray();
                            client.close();
                            break;
                        }
                        case MongoOption.Bulk: {
                            result = await collection.bulkWrite(params.query);
                            client.close();
                            break;
                        }
                        case MongoOption.Aggregate: {
                            let cursor: any = [];
                            if ( params.project !== undefined && params.project !== null ) {
                                cursor = collection.aggregate(params.query).project(params.project);
                            } else {
                                cursor = collection.aggregate(params.query);
                            }
                            result = await cursor.toArray();
                            client.close();
                            break;
                        }
                        case MongoOption.InsertMany: {
                            if ( params.documents!.length > 0 ) {
                                result = await collection.insertMany( params.documents! );
                                client.close();
                            } else {  result = []; }
                        }
                    }
                    // await config.logger.info('finished');
                    if ( result instanceof Array ) {
                        return result ? result : [];
                    } else {
                        result = JustDetective.simpleDetect(result) ? [result] : [];
                        return result;
                    }
                }
            }
        };
        super(id, style, magician, chapter, inOneWord);
    }
}
