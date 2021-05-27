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
  });
});
