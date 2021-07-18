import { ServerError } from "../errors";
import { HttpResponse } from "../protocols/http";

// Classe pra ser retornada quando o erro for BadRequest
export class BadRequest implements HttpResponse{
    statusCode = 400;
    body: Error;

    constructor(error: Error){
        this.body = error;
    }
}
// Classe pra ser retornada quando o erro for InternalServerError
export class InternalServerError implements HttpResponse{
    statusCode = 500;
    body = new ServerError();
}




// Função que retorna um HttpResponse quando o erro for BadRequest
export const badRequest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}
// Função que retorna um HttpResponse quando o erro for InternalServerError
export const internalServerError = (): HttpResponse => {
    return {
        statusCode: 500,
        body: new ServerError()
    }
}