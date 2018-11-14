import { MagicShow, IMagicShow } from '../models/MagicShow';
import { GeoMagicShow } from '../shows/Geo.MagicShow';
import { MongoMagicShow } from '../shows/Mongo.MagicShow';
import { MysqlMagicShow } from '../shows/Mysql.MagicShow';

export enum SpellStyle {
    Fireball = 'Fireball',
    GeoMagic = 'GeoMagic',
    MongoMagic = 'MongoMagic',
    MysqlMagic = 'MysqlMagic'
}

export function MagicShowFactory( show: IMagicShow , spell: any = SpellStyle.Fireball ) {
    spell = show.style || spell;
    switch (spell) {
        case SpellStyle.Fireball: {
            return new MagicShow( show.id, show.style, show.magician!, show.chapter );
        }
        case SpellStyle.GeoMagic: {
            return new GeoMagicShow( show.id, SpellStyle.GeoMagic, show.chapter );
        }
        case SpellStyle.MongoMagic: {
            return new MongoMagicShow( show.id, SpellStyle.MongoMagic, show.chapter );
        }
        case SpellStyle.MysqlMagic: {
            return new MysqlMagicShow( show.id, SpellStyle.MongoMagic, show.chapter );
        }
    }
    console.error(TypeError('Error Style of magicshow: ' + show.id + `(${spell})`));
    process.exit(-1);
    return new MagicShow( show.id, show.style, show.magician!, show.chapter );
}
