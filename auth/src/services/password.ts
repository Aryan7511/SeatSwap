import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';


/*Script is the hashing function that we're going to use as script is fantastic.
The downside to it is that is callback based.
We want to eventually use async, await for doing a lot of logic inside of here.
So I got promisify so we can take this callback based function and turn it into a promise based implementation
which is compatible with using async await. */
const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');  //generate a random string for us.
    /*Now, if we mouse over buf you'll notice that unfortunately TypeScript is getting a
little bit confused because it doesn't really know what happened during this promisify process.
So when we hover over buffer it's type is annotated as unknown typescript.
TypeScript is saying I have no idea what is going on here.
So we're going to fix this up by just telling TypeScript exactly what buf is.
I'm going to wrap this entire await statement with the set of parentheses, and then at the very end,
I'll put on as buffer. That's telling TypeScript. */
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}
