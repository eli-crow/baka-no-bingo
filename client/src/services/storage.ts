import type { Player, ServerGame } from '@shared';

interface StorageService {
  playerId: Player['id'] | undefined;
  gameCode: ServerGame['code'] | undefined;
}

const LOCAL_STORAGE_REVIVERS: {
  [K in keyof StorageService]: (value: string) => StorageService[K];
} = {
  playerId: value => value,
  gameCode: value => value,
};

function createLocalStorageService() {
  return new Proxy({} as StorageService, {
    get: (_, prop) => {
      const data = localStorage.getItem(prop as keyof StorageService);
      if (data === null) {
        return undefined;
      }
      const reviver = LOCAL_STORAGE_REVIVERS[prop as keyof StorageService];
      return reviver(data);
    },

    set: (_, prop, value) => {
      localStorage.setItem(prop as keyof StorageService, value);
      return true;
    },

    deleteProperty: (_, prop) => {
      localStorage.removeItem(prop as keyof StorageService);
      return true;
    },
  });
}

function createSessionStorageService() {
  return new Proxy({} as StorageService, {
    get: (_, prop) => {
      const data = sessionStorage.getItem(prop as keyof StorageService);
      if (data === null) {
        return undefined;
      }
      const reviver = LOCAL_STORAGE_REVIVERS[prop as keyof StorageService];
      return reviver(data);
    },

    set: (_, prop, value) => {
      sessionStorage.setItem(prop as keyof StorageService, value);
      return true;
    },

    deleteProperty: (_, prop) => {
      sessionStorage.removeItem(prop as keyof StorageService);
      return true;
    },
  });
}

function createStorageService(): StorageService {
  return createSessionStorageService();
}

export default createStorageService();
