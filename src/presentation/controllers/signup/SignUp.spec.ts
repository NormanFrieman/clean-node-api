import { AccountModel, AddAccount, AddAccountModel, EmailValidator, HttpRequest, HttpResponse } from "./signup-protocols";
import { InvalidParamError, MissingParamError, ServerError } from "../../errors";
import { SignUpController } from "./SignUp";

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean{
            return true;
        }
    }

    return new EmailValidatorStub();
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount{
        add(account: AddAccountModel): AccountModel{
            return {
                id: 'valid_id',
                name: 'valid name',
                email: 'valid_email@mail.com',
                password: 'valid_password'
            };
        }
    }

    return new AddAccountStub();
}

interface SutTypes{
    sut: SignUpController,
    emailValidatorStub: EmailValidator,
    addAccountStub: AddAccount
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
    test('Should return 400 if no name is provided', () => {
        const { sut } = makeSut();
        const httpRequest: HttpRequest = {
            body:{
                // name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    }),
    test('Should return 400 if no email is provided', () => {
        const { sut } = makeSut();
        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                // email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    }),
    test('Should return 400 if no password is provided', () => {
        const { sut } = makeSut();
        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                // password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    }),
    test('Should return 400 if no passwordConfirmation is provided', () => {
        const { sut } = makeSut();
        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                // passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
    }),
    test('Should return 400 if password confirmation fails', () => {
        const { sut } = makeSut();

        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                email: 'invalid_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
    }),
    test('Should return 400 if an invalid email is provided', () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                email: 'invalid_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    }),
    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com');
    }),
    test('Should returns 500 if EmailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut();
        
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        })

        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    }),
    test('Should returns 500 if AddAcount throws', () => {
        const { sut, addAccountStub } = makeSut();
        
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            throw new Error();
        })

        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        const httpResponse: HttpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    }),
    test('Should call AddAccount with correct values', () => {
        const { sut, addAccountStub } = makeSut();

        const addSpy = jest.spyOn(addAccountStub, 'add');

        const httpRequest: HttpRequest = {
            body:{
                name: 'any name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };
        
        sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any name',
            email: 'any_mail@mail.com',
            password: 'any_password'
        });
    })
})