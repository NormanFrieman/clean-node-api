import { HttpResponse } from "../protocols/http";

// Classe pra ser retornada quando o erro for BadRequest
export class BadRequest implements HttpResponse{
    statusCode = 400;
    body: Error;

    constructor(bodyRequest: Error){
        this.body = bodyRequest;
    }
}

// Função que retorna um HttpResponse quando o erro for BadRequest
export const badRequest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}