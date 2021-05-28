const { app } = require('../serveur');

let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

describe('User', function () {
  describe('POST /api/user/register', function () {
    it('Body Vide', function (done) {
      chai
        .request(app)
        .post('/api/user/register')
        .then(function (res) {
          expect(res.status).to.equal(400);
          done();
        })
        .catch(function (err) {
          throw err;
        });
    });

    it('Username déjà existant', (done) => {
      chai
        .request(app)
        .post('/api/user/register')
        .send({
          username: 'admin',
          password: '123456',
          email: 'admin@admin.com',
        })
        .then(function (res) {
          expect(res.status).to.equal(400);
          done();
        })
        .catch(function (err) {
          throw err;
        });
    });

    it('Bon utilisateur', (done) => {
      chai
        .request(app)
        .post('/api/user/register')
        .send({
          username: 'user',
          password: '123456',
          email: 'user@user.com',
        })
        .then(function (res) {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(function (err) {
          throw err;
        });
    });
  });
});
