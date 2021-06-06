const { app } = require('../serveur');

const global = require('./hooks').global;
const fs = require('fs');
const path = require('path');

let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Challenge', function () {
  describe('POST /api/challenge', () => {
    it('Body vide', (done) => {
      chai
        .request(app)
        .post('/api/challenge')
        .then(function (res) {
          expect(res.status).to.equal(400);
          done();
        })
        .catch(function (err) {
          throw err;
        });
    });

    it('User pas admin', function (done) {
      if (global.jwt === undefined) {
        this.skip();
      }

      let img =
        'data:image/webp;base64,' +
        fs
          .readFileSync(path.join(__dirname, './assets/map.webp'))
          .toString('base64');

      chai
        .request(app)
        .post('/api/challenge')
        .set('Authorization', 'Bearer ' + global.jwt)

        .send({
          title: 'Challenge Test',
          description: 'Une super description pour un challenge de test',
          echelle: 1500,
          img_fond: img,
        })
        .then(function (res) {
          expect(res.status).to.equal(403);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });

    it('Body correcte', function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      let img =
        'data:image/webp;base64,' +
        fs
          .readFileSync(path.join(__dirname, './assets/map.webp'))
          .toString('base64');

      chai
        .request(app)
        .post('/api/challenge')
        .set('Authorization', 'Bearer ' + global.jwt_admin)

        .send({
          title: 'Challenge Test',
          description: 'Une super description pour un challenge de test',
          echelle: 1500,
          img_fond: img,
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('published').with.equal(false);
          expect(res.body)
            .to.have.property('title')
            .with.equal('Challenge Test');
          expect(res.body)
            .to.have.property('description')
            .with.equal('Une super description pour un challenge de test');

          expect(res.body).to.have.property('echelle').with.equal(1500);

          global.challenge_id = res.body.id;

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });
  });

  describe('POST /api/challenge/:id', () => {
    it('Body correcte', (done) => {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.challenge_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/challenge/' + global.challenge_id)
        .set('Authorization', 'Bearer ' + global.jwt_admin)

        .send({
          title: 'Challenge Test Edité',
          description: 'Une super description pour un challenge de test édité',
          echelle: 100,
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('published').with.equal(false);
          expect(res.body)
            .to.have.property('title')
            .with.equal('Challenge Test Edité');
          expect(res.body)
            .to.have.property('description')
            .with.equal(
              'Une super description pour un challenge de test édité'
            );

          expect(res.body).to.have.property('echelle').with.equal(100);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });
  });
});
