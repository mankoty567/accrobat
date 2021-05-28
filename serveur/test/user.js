const { app } = require('../serveur');

const global = require('./hooks').global;

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

  describe('POST /api/user/login', () => {
    it("Connecter l'utilisateur", (done) => {
      chai
        .request(app)
        .post('/api/user/login')
        .send({
          username: 'user',
          password: '123456',
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('username').with.equal('user');
          expect(res.body)
            .to.have.property('email')
            .with.equal('user@user.com');
          expect(res.body).to.have.property('permission').with.equal(0);
          expect(res.body).to.have.property('jwt');

          global.jwt = res.body.jwt;

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  describe('POST /api/user/whoami', () => {
    it('Passe un JWT Valide', (done) => {
      if (global.jwt === undefined) {
        this.skip();
        return;
      }

      chai
        .request(app)
        .get('/api/user/whoami')
        .set('Authorization', 'Bearer ' + global.jwt)
        .then((res) => {
          expect(res.status).to.equal(200);

          console.log(res.status);
          console.log(res.body);
        });
    });
  });
});
