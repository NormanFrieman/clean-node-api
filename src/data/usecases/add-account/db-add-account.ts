import { IAccountModel, IAddAccount, IAddAccountModel, IAddAccountRepository, IEncrypter } from "./db-add-account-protocols";

export class DbAddAccount implements IAddAccount{
    constructor(
        private readonly encrypter: IEncrypter,
        private readonly addAccountRepository: IAddAccountRepository
    ){}

    async add(accountData: IAddAccountModel): Promise<IAccountModel>{
        const hashedPassword: string = await this.encrypter.encrypt(accountData.password);
        const account: IAccountModel = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
        
        return account;
    }
}