const { app } = require('../serveur');

const global = require('./hooks').global;

let chai = require('chai');
let chaiHttp = require('chai-http');

const fixture = require('./assets/fixture');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Challenge 2', () => {
  describe('POST /api/challenge/:id/validity', () => {
    it('Etre bon', function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.challenge_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .get('/api/challenge/' + global.challenge_id + '/validity')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('valid').to.equal(true);
          expect(res.body).to.have.property('error').to.have.length(0);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });

    it('Etre invalide', async function () {
      let pasBonId = fixture.pasBonChallenge();

      if (global.jwt_admin === undefined) {
        this.skip();
      }

      let res = await chai
        .request(app)
        .get('/api/challenge/' + pasBonId + '/validity')
        .set('Authorization', 'Bearer ' + global.jwt_admin);

      expect(res.status).to.equal(200);

      expect(res.body).to.have.property('valid').to.equal(false);
      expect(res.body)
        .to.have.property('error')
        .to.have.members(['not_1_start', 'not_1_end']);
    });
  });

  describe('POST /api/challenge/:id/publish', () => {
    it('Publication', function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.challenge_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/challenge/' + global.challenge_id + '/publish')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('published').to.equal(true);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });
  });
});
