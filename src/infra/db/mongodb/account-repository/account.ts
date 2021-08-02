import { MongoHelper } from "../helpers/mongo-helper";
import { IAddAccountRepository } from "../../../../data/protocols";
import { IAccountModel } from "../../../../domain/models/account";
import { IAddAccountModel } from "../../../../domain/usecases/add-account";

export class AccountMongoRepository implements IAddAccountRepository{
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
        const accountColletion = MongoHelper.getCollection('accounts');
        const id = (await accountColletion.insertOne(accountData)).insertedId;
        
        return MongoHelper.map(await accountColletion.findOne(id));
    }
}