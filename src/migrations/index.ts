import * as migration_20261017_074654 from './20261017_074654';
import * as migration_20261020_092736_add_media_objectkey from './20261020_092736_add_media_objectkey';
import * as migration_20261030_061238_add_player_physical_fields from './20261030_061238_add_player_physical_fields';
import * as migration_20261030_070309_position_hasmany from './20261030_070309_position_hasmany';

export const migrations = [
  {
    up: migration_20261017_074654.up,
    down: migration_20261017_074654.down,
    name: '20261017_074654',
  },
  {
    up: migration_20261020_092736_add_media_objectkey.up,
    down: migration_20261020_092736_add_media_objectkey.down,
    name: '20261020_092736_add_media_objectkey',
  },
  {
    up: migration_20261030_061238_add_player_physical_fields.up,
    down: migration_20261030_061238_add_player_physical_fields.down,
    name: '20261030_061238_add_player_physical_fields',
  },
  {
    up: migration_20261030_070309_position_hasmany.up,
    down: migration_20261030_070309_position_hasmany.down,
    name: '20261030_070309_position_hasmany'
  },
];
