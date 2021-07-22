import { AddAccountModel } from "../../../domain/usecases/add-account";
import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', async () => {
        class EncrypterStub implements Encrypter{
            async encrypt(value: string): Promise<string>{
                return new Promise(resolve => resolve('hashed_password'));
            }
        }
        
        const encrypterStub = new EncrypterStub();
        const sut = new DbAddAccount(encrypterStub);
        
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
        const accountData: AddAccountModel = {
            name: 'valid name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
    })
})