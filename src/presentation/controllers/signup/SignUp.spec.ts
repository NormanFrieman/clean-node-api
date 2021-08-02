import { IAccountModel, IAddAccount, IAddAccountModel, IEmailValidator, IHttpRequest, IHttpResponse } from "./signup-protocols";
import { InvalidParamError, MissingParamError, ServerError } from "../../errors";
import { SignUpController } from "./SignUp";

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator{
        isValid(email: string): boolean{
            return true;
        }
    }

    return new EmailValidatorStub();
}

const makeAddAccount = (): IAddAccount => {
    class AddAccountStub implements IAddAccount{
        async add(account: IAddAccountModel): Promise<IAccountModel>{
            const fakeAccount: IAccountModel = {
                id: 'valid_id',
                name: 'valid name',
                email: 'valid_mail@mail.com',
                password: 'valid_password'
            };

            return new Promise(resolve => resolve(fakeAccount));
        }
    }

    return new AddAccountStub();
}

interface SutTypes{
    sut: SignUpController,
    emailValidatorStub: IEmailValidator,
    addAccountStub: IAddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    return {
        sut: sut,
        emailValidatorStub: emailValidatorStub,
        addAccountStub: addAccountStub
    };
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const { sut } = makeSut();
        const httpRequest: IHttpRequest = {
            body:{
                // name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    }),
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                // email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    }),
    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                // password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    }),
    test('Should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut();
        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                // passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
    }),
    test('Should return 400 if password confirmation fails', async () => {
        const { sut } = makeSut();

        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                email: 'invalid_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
    }),
    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                email: 'invalid_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    }),
    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com');
    }),
    test('Should returns 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();
        
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        })

        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    }),
    test('Should returns 500 if AddAcount throws', async () => {
        const { sut, addAccountStub } = makeSut();
        
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        });

        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    }),
    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut();

        const addSpy = jest.spyOn(addAccountStub, 'add');

        const httpRequest: IHttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        await sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any name',
            email: 'any_mail@mail.com',
            password: 'any_password'
        });
    }),
    test('Should return 200 if valid data is provider', async () => {
        const { sut } = makeSut();

        const httpRequest: IHttpRequest = {
            body:{
                name: 'valid name',
                email: 'valid_mail@mail.com',
                password: 'valid_password',
                passwordConfirmation: 'valid_password'
            }
        };
        
        const httpResponse: IHttpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        });
    })
})