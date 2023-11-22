import { ServerError } from './ServerError.js';

// The only exports of this file should be errors.
export class GameNotFoundError extends ServerError {}
export class PlayerNotFoundError extends ServerError {}
export class ActionNotAllowedError extends ServerError {}
export class PlayerNotInGameError extends ServerError {}
