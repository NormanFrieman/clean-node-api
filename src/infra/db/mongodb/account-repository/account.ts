import { MongoHelper } from "../helpers/mongo-helper";
import { AddAccountRepository } from "../../../../data/protocols";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";

export class AccountMongoRepository implements AddAccountRepository{
    async add(accountData: AddAccountModel): Promise<AccountModel> {
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