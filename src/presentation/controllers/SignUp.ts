import { AddAccount, AddAccountModel } from "../../domain/usecases/add-account";
import { InvalidParamError, MissingParamError } from "../errors";
import { BadRequest, InternalServerError } from "../helpers/http-helper"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../protocols";

export class SignUpController implements Controller{
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAcount: AddAccount
    ){}

    handle(httpRequest: HttpRequest): HttpResponse{
        try{
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

            for(const field of requiredFields){
                if(!httpRequest.body[field]){
                    return new BadRequest(new MissingParamError(field));
                }
            }

            const { name, email, password, passwordConfirmation } = httpRequest.body;

            if(password !== passwordConfirmation){
                return new BadRequest(new InvalidParamError('passwordConfirmation'));
            }

            const isValid = this.emailValidator.isValid(email);
            if(!isValid){
                return new BadRequest(new InvalidParamError('email'));
            }

            const user: AddAccountModel = {
                name,
                email,
                password
            };

            this.addAcount.add(user);
        }catch(err){
            return new InternalServerError();
        }
    }
}