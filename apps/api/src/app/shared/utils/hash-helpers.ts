import * as argon2 from 'argon2';

const OPTIONS: argon2.Options = { secret: Buffer.from(process.env.PASSWORD_HASH_SECRET), type: argon2.argon2id };

export function getArgon2Hash(data: string): Promise<string> {
  // @ts-ignore
  return argon2.hash(data, OPTIONS);
}

export function compareArgon2Hash(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain, OPTIONS);
}
