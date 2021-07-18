import { MissingParamError } from "../errors/misssing-param-error";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { SignUpController } from "./SignUp";

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const sut = new SignUpController();
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
        const sut = new SignUpController();
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
    })
})