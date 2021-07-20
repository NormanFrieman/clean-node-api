import { EmailValidatorAdapter } from "./email-validator";
import validator from 'validator';

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter();
}

describe('EmailValidator adapter', () => {
    test('Should return false if validator returns false', () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
        const sut = makeSut();

        const isValid = sut.isValid('invalid_mail@mail.com');

        expect(isValid).toBe(false);
    }),
    test('Should return false if validator returns false', () => {
        const sut = makeSut();
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
        const isValid = sut.isValid('valid_mail@mail.com');

        expect(isValid).toBe(true);
    }),
    test('Should call validator with correct email', () => {
        const sut = makeSut();
        const isEmailSpy = jest.spyOn(validator, 'isEmail');
        
        sut.isValid('any_mail@mail.com');

        expect(isEmailSpy).toHaveBeenCalledWith('any_mail@mail.com')
    })
});