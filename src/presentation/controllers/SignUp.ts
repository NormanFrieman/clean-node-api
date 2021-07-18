import { MissingParamError } from "../errors/misssing-param-error"
import { BadRequest } from "../helpers/http-helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController{
    handle(httpRequest: HttpRequest): HttpResponse{
        if(!httpRequest.body.name){
            return new BadRequest(new MissingParamError('name'));
        }

        if(!httpRequest.body.email){
            return new BadRequest(new MissingParamError('email'));
        }
    }
}