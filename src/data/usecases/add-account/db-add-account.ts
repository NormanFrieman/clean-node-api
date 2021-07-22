import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount{
    constructor(
        private readonly encrypter: Encrypter,
        private readonly addAccountRepository: AddAccountRepository
    ){}

    async add(accountData: AddAccountModel): Promise<AccountModel>{
        const hashedPassword: string = await this.encrypter.encrypt(accountData.password);
        const account: AccountModel = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
        
        return account;
    }
}