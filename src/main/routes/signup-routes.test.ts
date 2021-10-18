import request = require('supertest');
import app from '../config/app';

describe('SignUp Routes', () => {
    test('Should return an account on sucess', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Norman',
                email: 'normanfrieman@gail.com',
                password: '123',
                passwordConfirmation: '123'
            })
            .expect(200);
    })
})