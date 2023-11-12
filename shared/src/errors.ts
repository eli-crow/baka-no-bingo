export class RoomNotFoundError extends Error {
  constructor() {
    super('Room not found');
  }
}

export class PlayerNotFoundError extends Error {
  constructor() {
    super('Player not found');
  }
}

export class ActionNotAllowedError extends Error {
  constructor() {
    super('Action not allowed');
  }
}
