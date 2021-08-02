import { IAddAccount, IAddAccountModel, IController, IEmailValidator, IHttpRequest, IHttpResponse } from "./signup-protocols";
import { InvalidParamError, MissingParamError } from "../../errors";
import { BadRequest, InternalServerError, Ok } from "../../helpers/http-helper";

export class SignUpController implements IController{
    constructor(
        private readonly emailValidator: IEmailValidator,
        private readonly addAcount: IAddAccount
    ){}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse>{
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

            const user: IAddAccountModel = {
                name,
                email,
                password
            };

            const account = await this.addAcount.add(user);

            return new Ok(account);
        }catch(err){
            console.error(err);
            return new InternalServerError();
        }
    }
}