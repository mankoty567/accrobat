const { app } = require('../serveur');

const global = require('./hooks').global;

let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

describe('PointPassage', function () {
  describe('POST /api/challenge/:id/point', () => {
    it('Mauvais Body', (done) => {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.challenge_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/challenge/' + global.challenge_id + '/point')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .then(function (res) {
          expect(res.status).to.equal(400);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });

    it("Challenge n'existe pas", (done) => {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/challenge/-1/point')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          title: 'Début',
          description: 'Le premier point de passage du challenge',
          type: 'start',
          x: 0.1,
          y: 0.1,
        })
        .then(function (res) {
          expect(res.status).to.equal(404);

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

      if (global.challenge_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/challenge/' + global.challenge_id + '/point')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          title: 'Début',
          description: 'Le premier point de passage du challenge',
          type: 'start',
          x: 0.1,
          y: 0.1,
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          global.start_point_id = res.body.id;

          expect(res.body).to.have.property('title').with.equal('Début');
          expect(res.body)
            .to.have.property('description')
            .with.equal('Le premier point de passage du challenge');
          expect(res.body).to.have.property('type').with.equal('start');

          expect(res.body).to.have.property('x').with.equal(0.1);
          expect(res.body).to.have.property('y').with.equal(0.1);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });

    it('Bulk Ajout', async function () {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.challenge_id === undefined) {
        this.skip();
      }

      let res1 = await chai
        .request(app)
        .post('/api/challenge/' + global.challenge_id + '/point')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          title: 'Milieu',
          description: 'Le deuxième point de passage du challenge',
          type: 'point',
          x: 0.4,
          y: 0.4,
        });

      expect(res1.status).to.equal(200);

      global.middle_point_id = res1.body.id;

      let res2 = await chai
        .request(app)
        .post('/api/challenge/' + global.challenge_id + '/point')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          title: 'Fin',
          description: 'Le dernier point de passage du challenge',
          type: 'end',
          x: 0.7,
          y: 0.7,
        });

      expect(res2.status).to.equal(200);

      global.end_point_id = res2.body.id;
    });
  });

  describe('POST /api/pointpassage/:id', () => {
    it("Point qui n'existe pas", function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/pointpassage/-1')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .then(function (res) {
          expect(res.status).to.equal(404);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });

    it('Modification du Point', function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.start_point_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/pointpassage/' + global.start_point_id)
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          title: 'Début Modifié',
          description: 'Le premier point de passage du challenge Modifié',
          x: 0.15,
          y: 0.15,
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body)
            .to.have.property('title')
            .with.equal('Début Modifié');
          expect(res.body)
            .to.have.property('description')
            .with.equal('Le premier point de passage du challenge Modifié');
          expect(res.body).to.have.property('type').with.equal('start');

          expect(res.body).to.have.property('x').with.equal(0.15);
          expect(res.body).to.have.property('y').with.equal(0.15);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });
  });
});
