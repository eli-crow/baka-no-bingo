interface LocalStorageData {
  playerId: string | undefined;
  roomCode: string | undefined;
}

const LOCAL_STORAGE_REVIVERS: {
  [K in keyof LocalStorageData]: (value: string) => LocalStorageData[K];
} = {
  playerId: value => value,
  roomCode: value => value,
};

export default new Proxy({} as LocalStorageData, {
  get: (_, prop) => {
    const data = localStorage.getItem('data');
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
    let didDelete = localStorage.getItem('data') !== null;
    localStorage.removeItem('data');
    return didDelete;
  },
});
