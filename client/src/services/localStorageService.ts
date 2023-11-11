import type { PlayerData, RoomData } from '@shared';

interface LocalStorageData {
  playerId: PlayerData['id'] | undefined;
  roomCode: RoomData['code'] | undefined;
}

const LOCAL_STORAGE_REVIVERS: {
  [K in keyof LocalStorageData]: (value: string) => LocalStorageData[K];
} = {
  playerId: value => value,
  roomCode: value => value,
};

export default new Proxy({} as LocalStorageData, {
  get: (_, prop) => {
    const data = localStorage.getItem(prop as string);
    if (data === null) {
      return undefined;
    }
    const reviver = LOCAL_STORAGE_REVIVERS[prop as keyof LocalStorageData];
    return reviver(data);
  },
  set: (_, prop, value) => {
    if (typeof prop !== 'string') {
      return false;
    }
    localStorage.setItem(prop, value);
    return true;
  },
  deleteProperty: (_, prop) => {
    localStorage.removeItem('data');
    return true;
  },
});
