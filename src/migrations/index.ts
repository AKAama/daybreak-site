import * as migration_20261017_074654 from './20261017_074654';
import * as migration_20261020_092736_add_media_objectkey from './20261020_092736_add_media_objectkey';

export const migrations = [
  {
    up: migration_20261017_074654.up,
    down: migration_20261017_074654.down,
    name: '20261017_074654',
  },
  {
    up: migration_20261020_092736_add_media_objectkey.up,
    down: migration_20261020_092736_add_media_objectkey.down,
    name: '20261020_092736_add_media_objectkey'
  },
];
