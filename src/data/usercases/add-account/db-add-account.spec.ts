import { AddAccountModel, Encrypter } from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

interface SutTypes{
    sut: DbAddAccount,
    encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter{
        async encrypt(value: string): Promise<string>{
            return new Promise(resolve => resolve('hashed_password'));
        }
    }
    
    return new EncrypterStub();
}

const makeSut = (): SutTypes => {    
    const encrypterStub = makeEncrypter();
    const sut = new DbAddAccount(encrypterStub);

    return {
        sut: sut,
        encrypterStub: encrypterStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut();
        
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
        const accountData: AddAccountModel = {
            name: 'valid name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        };
        
        await sut.add(accountData);
        expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
    }),
    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();
        
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const accountData: AddAccountModel = {
            name: 'valid name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        };
        
        const promise = sut.add(accountData);
        await expect(promise).rejects.toThrow();
    })
})