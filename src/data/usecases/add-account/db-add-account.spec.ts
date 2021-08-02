import { IAddAccountModel, IAccountModel, IEncrypter, IAddAccountRepository } from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): IEncrypter => {
    class EncrypterStub implements IEncrypter{
        async encrypt(value: string): Promise<string>{
            return new Promise(resolve => resolve('hashed_password'));
        }
    }
    
    return new EncrypterStub();
}

const makeAddAccountRepository = (): IAddAccountRepository => {
    class AddAccountRepositoryStub implements IAddAccountRepository{
        async add(accountData: IAddAccountModel): Promise<IAccountModel>{
            const fakeAccount: IAccountModel = {
                id: 'valid_id',
                name: 'valid name',
                email: 'valid_mail',
                password: 'hashed_password'
            };
            return new Promise(resolve => resolve(fakeAccount));
        }
    }
    
    return new AddAccountRepositoryStub();
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter();
    const addAccountRepositoryStub = makeAddAccountRepository();
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

    return {
        sut: sut,
        encrypterStub: encrypterStub,
        addAccountRepositoryStub: addAccountRepositoryStub
    }
}

interface SutTypes{
    sut: DbAddAccount,
    encrypterStub: IEncrypter,
    addAccountRepositoryStub: IAddAccountRepository
}

describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut();
        
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
        const accountData: IAddAccountModel = {
            name: 'valid name',
            email: 'valid_mail',
            password: 'valid_password'
        };
        
        await sut.add(accountData);
        expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
    }),
    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();
        
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const accountData: IAddAccountModel = {
            name: 'valid name',
            email: 'valid_mail',
            password: 'valid_password'
        };
        
        const promise = sut.add(accountData);
        await expect(promise).rejects.toThrow();
    }),
    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        const accountData: IAddAccountModel = {
            name: 'valid name',
            email: 'valid_mail',
            password: 'valid_password'
        };
        
        await sut.add(accountData);
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid name',
            email: 'valid_mail',
            password: 'hashed_password'
        });
    }),
    test('Should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const accountData: IAddAccountModel = {
            name: 'valid name',
            email: 'valid_mail',
            password: 'valid_password'
        };
        
        const promise = sut.add(accountData);
        await expect(promise).rejects.toThrow();
    }),
    test('Should returns an account on success', async () => {
        const { sut } = makeSut();
        
        const accountData: IAddAccountModel = {
            name: 'valid name',
            email: 'valid_mail',
            password: 'valid_password'
        };
        
        const account = await sut.add(accountData);
        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid name',
            email: 'valid_mail',
            password: 'hashed_password'
        })
    })
})