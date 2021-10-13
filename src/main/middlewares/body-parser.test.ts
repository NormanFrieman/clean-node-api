import request = require('supertest');
import app from '../config/app';

describe('Body Parser Middleware', () => {
    test('Should parse body as JSON', async () => {
        app.post('/test_body_parser', (req, res) => res.send(req.body));

        await request(app)
            .post('/test_body_parser')
            .send({ name: 'Norman' })
            .expect({ name: 'Norman' });
    })
})