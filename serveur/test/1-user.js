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
    it("Connecter l'utilisateur normal", (done) => {
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

    it("Connecter l'utilisateur admin", (done) => {
      chai
        .request(app)
        .post('/api/user/login')
        .send({
          username: 'admin',
          password: '123456',
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('username').with.equal('admin');
          expect(res.body)
            .to.have.property('email')
            .with.equal('admin@example.com');
          expect(res.body).to.have.property('permission').with.equal(1000);
          expect(res.body).to.have.property('jwt');

          global.jwt_admin = res.body.jwt;

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  describe('POST /api/user/whoami', () => {
    it('Passe un JWT Valide', function (done) {
      if (global.jwt === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .get('/api/user/whoami')
        .set('Authorization', 'Bearer ' + global.jwt)
        .then((res) => {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('username').with.equal('user');
          expect(res.body)
            .to.have.property('email')
            .with.equal('user@user.com');
          expect(res.body).to.have.property('permission').with.equal(0);
          expect(res.body).to.have.property('jwt');

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });

    it('JWT Invalide', (done) => {
      chai
        .request(app)
        .get('/api/user/whoami')
        .set('Authorization', 'Bearer 123456')
        .then((res) => {
          expect(res.status).to.equal(400);

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  describe('POST /api/user/edit', () => {
    it("Changement de l'utilisateur", function (done) {
      if (global.jwt === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/user/edit')
        .set('Authorization', 'Bearer ' + global.jwt)
        .send({
          username: 'userEdited',
          email: 'userEdited@user.com',
        })
        .then((res) => {
          expect(res.status).to.equal(200);

          expect(res.body)
            .to.have.property('username')
            .with.equal('userEdited');
          expect(res.body)
            .to.have.property('email')
            .with.equal('userEdited@user.com');
          expect(res.body).to.have.property('permission').with.equal(0);

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  describe('POST /api/user/edit_password', () => {
    it('Mauvais mot de passe initial', function (done) {
      if (global.jwt === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/user/edit_password')
        .set('Authorization', 'Bearer ' + global.jwt)
        .send({
          old_password: 'string',
          new_password: '12345678',
          repeat_password: '12345678',
        })
        .then((res) => {
          expect(res.status).to.equal(403);

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });

    it('Bon mot de passe', function (done) {
      if (global.jwt === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/user/edit_password')
        .set('Authorization', 'Bearer ' + global.jwt)
        .send({
          old_password: '123456',
          new_password: '12345678',
          repeat_password: '12345678',
        })
        .then((res) => {
          expect(res.status).to.equal(200);

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  describe('GET /api/user/check_username/:username', () => {
    it('Utilisateur disponible', (done) => {
      chai
        .request(app)
        .get('/api/user/check_username/free')
        .then((res) => {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('valid').with.equal(true);

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });

    it('Utilisateur non disponible', (done) => {
      chai
        .request(app)
        .get('/api/user/check_username/admin')
        .then((res) => {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('valid').with.equal(false);

          done();
        })
        .catch(function (err) {
          throw err;
        });
    });
  });
});
