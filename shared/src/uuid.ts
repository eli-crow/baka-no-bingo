import { randomUUID } from 'crypto';

export function getUuid(): string {
  return randomUUID();
}
