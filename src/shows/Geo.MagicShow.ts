import { MagicShow} from '../models/MagicShow';
import { IMagician } from '../models/Magician';
import { JustDetective } from 'justtools';
import { createClient } from '@google/maps';
import { SpellStyle } from '../utils/MagicshowFactory';

export interface IGeoParams {
    key: any;
    address: string;
}

/**
 * params { key: goold api key , address: search place}
 */
export class GeoMagicShow extends MagicShow {
    /**
     * Geocoding Magic Show
     * @param id
     * @param chapter
     */
    constructor( id: string  ,  style = SpellStyle.GeoMagic, chapter?: number, inOneWord = 'Geocoding for address') {
        const magician: IMagician = {
            magic: {
                toExecuteFunction: async( params: IGeoParams ) => {
                const client = await createClient({ key: params.key });
                if (!client) { throw new TypeError('Cannot create google map connection'); }
                JustDetective.detect( params.address, (addr: any) => {}, '/googlemap/address'  );
                const result = await new Promise(( resolve, reject ) => {
                    client.geocode({address: params.address}, (error, response) => {
                        if (error) {
                            reject(error);
                        } else if (response.json.results) {
                            resolve(response.json.results);
                        }
                    });
                });
                return result ? result : [];
                }
            }
        };
        super(id, style, magician, chapter, inOneWord);
    }
}
