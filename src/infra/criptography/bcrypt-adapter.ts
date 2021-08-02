import { IEncrypter } from "../../data/protocols";
import * as bcrypt from 'bcrypt';

export class BCryptAdapter implements IEncrypter{
    constructor(
        private readonly salt: number
    ){ }

    async encrypt(value: string): Promise<string>{
        const hash = await bcrypt.hash(value, this.salt);
        return hash;
    }
}