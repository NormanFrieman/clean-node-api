import { EmailValidatorAdapter } from "./email-validator";
import validator from 'validator';

describe('EmailValidator adapter', () => {
    test('Should return false if validator returns false', () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
        const sut = new EmailValidatorAdapter();

        const isValid = sut.isValid('invalid_email@mail.com');

        expect(isValid).toBe(false);
    }),
    test('Should return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter();
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
        const isValid = sut.isValid('valid_email@mail.com');

        expect(isValid).toBe(true);
    })
});