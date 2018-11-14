import { MagicShow} from '../models/MagicShow';
import { IMagician } from '../models/Magician';
import { JustDetective } from 'justtools';
import { SpellStyle } from '../utils/MagicshowFactory';
import * as Mysql from 'mysql';

export interface IMysqlParams {
    query: any;
    credentials: any;
}

export class MysqlMagicShow extends  MagicShow {
    constructor( id: string  ,  style = SpellStyle.MysqlMagic, chapter?: number, inOneWord = 'Mysql Magician allows Mongo Operations') {
        const magician: IMagician = {
            magic: {
                toExecuteFunction: async( params: IMysqlParams ) => {
                    JustDetective.detect(params, (d: any) => {} , `/MysqlDataSource/data`);
                    const queryy = params.query;
                    const credentialss = params.credentials;
                    const client = await Mysql.createPool({
                        connectionLimit: credentialss.connections,
                        host: credentialss.host,
                        user: credentialss.user,
                        password: credentialss.password,
                        database: credentialss.database
                    });
                    if (!client) { throw new TypeError('Cannot create mysql connection'); }
                    let result: any = await new Promise<any[]>((resolve, reject) => {
                        client.query(queryy, (error, results) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        });
                    });
                    client.end();
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
