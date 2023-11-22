import type { Player, ServerGame } from '@shared';

interface StorageService {
  playerId: Player['id'] | undefined;
  gameCode: ServerGame['code'] | undefined;
}

type StorageServiceRevivers = {
  [K in keyof StorageService]: (value: string) => StorageService[K];
};

const LOCAL_STORAGE_REVIVERS: StorageServiceRevivers = {
  playerId: value => value,
  gameCode: value => value,
};

function createStorageService(source: Storage) {
  return new Proxy({} as StorageService, {
    get: (_, prop) => {
      const data = source.getItem(prop as keyof StorageService);
      if (data === null) {
        return undefined;
      }
      const reviver = LOCAL_STORAGE_REVIVERS[prop as keyof StorageService];
      return reviver(data);
    },

    set: (_, prop, value) => {
      source.setItem(prop as keyof StorageService, value);
      return true;
    },

    deleteProperty: (_, prop) => {
      source.removeItem(prop as keyof StorageService);
      return true;
    },
  });
}

export default createStorageService(sessionStorage);
