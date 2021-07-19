import { InvalidParamError, MissingParamError, ServerError } from "../errors";
import { BadRequest, InternalServerError } from "../helpers/http-helper"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../protocols";

export class SignUpController implements Controller{
    constructor(
        private readonly emailValidator: EmailValidator
    ){}

    handle(httpRequest: HttpRequest): HttpResponse{
        try{
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

            for(const field of requiredFields){
                if(!httpRequest.body[field]){
                    return new BadRequest(new MissingParamError(field));
                }
            }

            if(httpRequest.body.password !== httpRequest.body.passwordConfirmation){
                return new BadRequest(new InvalidParamError('passwordConfirmation'));
            }

            const isValid = this.emailValidator.isValid(httpRequest.body.email);
            if(!isValid){
                return new BadRequest(new InvalidParamError('email'));
            }
        }catch(err){
            return new InternalServerError();
        }
    }
}