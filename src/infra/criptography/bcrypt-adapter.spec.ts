import { BCryptAdapter } from "./bcrypt-adapter";
import * as bcrypt from 'bcrypt';

const salt = 12;
const makeSut = (): BCryptAdapter => {
    return new BCryptAdapter(salt);
}

describe('BCrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const sut = makeSut();
        const hashSpy = jest.spyOn(bcrypt, 'hash');

        await sut.encrypt('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    }),
    test('Should return hash on sucess', async () => {
        const sut = makeSut();
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => new Promise(resolve => resolve('hash')));

        const hash = await sut.encrypt('any_value');

        expect(hash).toBe('hash');
    }),
    test('Should throw if bcrypt throws', async () => {
        const sut = makeSut();
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => new Promise((resolve, reject) => reject(new Error())));

        const promise = sut.encrypt('any_value');

        await expect(promise).rejects.toThrow();
    })
});