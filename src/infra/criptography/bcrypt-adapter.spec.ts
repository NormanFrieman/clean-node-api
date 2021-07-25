import { BCryptAdapter } from "./bcrypt-adapter";
import * as bcrypt from 'bcrypt';

describe('BCrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const salt = 12;
        const sut = new BCryptAdapter(salt);
        const hashSpy = jest.spyOn(bcrypt, 'hash');

        await sut.encrypt('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    }),
    test('Should return hash on sucess', async () => {
        const salt = 12;
        const sut = new BCryptAdapter(salt);
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => new Promise(resolve => resolve('hash')));

        const hash = await sut.encrypt('any_value');

        expect(hash).toBe('hash');
    })
});