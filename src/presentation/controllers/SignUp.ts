import { MissingParamError } from "../errors/misssing-param-error"
import { BadRequest } from "../helpers/http-helper"
import { Controller } from "../protocols/controller";
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController implements Controller{
    handle(httpRequest: HttpRequest): HttpResponse{
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

        for(const field of requiredFields){
            if(!httpRequest.body[field]){
                return new BadRequest(new MissingParamError(field));
            }
        }
    }
}