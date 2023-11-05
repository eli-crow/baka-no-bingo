import { nanoid } from 'nanoid';

export function getUuid(): string {
  return nanoid();
}
