import { InvalidParamError, MissingParamError, ServerError } from "../errors";
import { EmailValidator, HttpRequest, HttpResponse } from "../protocols";
import { SignUpController } from "./SignUp";

interface SutTypes{
    sut: SignUpController,
    emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean{
            return true;
        }
    }

    return new EmailValidatorStub();
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const sut = new SignUpController(emailValidatorStub);

    return {
        sut: sut,
        emailValidatorStub: emailValidatorStub
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
    })
})