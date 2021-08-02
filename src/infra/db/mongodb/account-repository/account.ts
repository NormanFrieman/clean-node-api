import { MongoHelper } from "../helpers/mongo-helper";
import { IAddAccountRepository } from "../../../../data/protocols";
import { IAccountModel } from "../../../../domain/models/account";
import { IAddAccountModel } from "../../../../domain/usecases/add-account";

export class AccountMongoRepository implements IAddAccountRepository{
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
        const accountColletion = MongoHelper.getCollection('accounts');
        const insertId = (await accountColletion.insertOne(accountData)).insertedId;
        const account = await accountColletion.findOne(insertId);

        return {
            id: insertId.id.toString(),
            name: account.name,
            email: account.email,
            password: account.password
        };
    }
}