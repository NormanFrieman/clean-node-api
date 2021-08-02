import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });
    
    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const accountColletion = MongoHelper.getCollection('accounts');
        await accountColletion.deleteMany({});
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    }

    test('Should return an account on sucess', async () => {
        const sut = makeSut();

        const account = await sut.add({
            name: 'any name',
            email: 'any_mail@mail.com',
            password: 'any_password'
        });

        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe('any name');
        expect(account.email).toBe('any_mail@mail.com');
        expect(account.password).toBe('any_password');
    });
})