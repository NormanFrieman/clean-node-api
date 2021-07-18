import { InvalidParamError, MissingParamError } from "../errors";
import { BadRequest } from "../helpers/http-helper"
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController implements Controller{
    constructor(
        private readonly emailValidator: EmailValidator
    ){}

    handle(httpRequest: HttpRequest): HttpResponse{
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

        for(const field of requiredFields){
            if(!httpRequest.body[field]){
                return new BadRequest(new MissingParamError(field));
            }
        }

        if(!this.emailValidator.isValid(httpRequest.body.email)){
            return new BadRequest(new InvalidParamError('email'));
        }
    }
}