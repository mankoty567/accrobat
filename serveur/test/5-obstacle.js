const { app } = require('../serveur');

const global = require('./hooks').global;

let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Obstacle', function () {
  describe('POST /api/obstacle', () => {
    it('Mauvais Body', function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/obstacle/')
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

    it('Pas de réponse spécifiée', function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.segment_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/obstacle/')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          title: 'Obstacle',
          description: 'Un super obstacle avec une belle description',
          type: 'question',
          distance: 0.5,
          SegmentId: global.segment_id,
        })
        .then(function (res) {
          expect(res.status).to.equal(400);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });

    it("Création d'obstacle", function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.segment_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/obstacle/')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          title: 'Obstacle',
          description: 'Un super obstacle avec une belle description',
          type: 'question',
          enigme_awnser: 'Oui',
          distance: 0.5,
          SegmentId: global.segment_id,
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('title').with.equal('Obstacle');
          expect(res.body)
            .to.have.property('description')
            .with.equal('Un super obstacle avec une belle description');
          expect(res.body).to.have.property('type').with.equal('question');
          expect(res.body).to.have.property('distance').with.equal(0.5);
          expect(res.body)
            .to.have.property('SegmentId')
            .with.equal(global.segment_id);

          global.obstacle_id = res.body.id;

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });
  });

  describe('POST /api/obstacle/:id', () => {
    it("Obstacle qui n'existe pas", function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/obstacle/-1')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({})
        .then(function (res) {
          expect(res.status).to.equal(404);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });

    it("Modification d'obstacle", function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.obstacle_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/obstacle/' + global.obstacle_id)
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          title: 'Obstacle Modifié',
          description: 'Un super obstacle avec une belle description Modifiée',
          distance: 0.4,
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body)
            .to.have.property('title')
            .with.equal('Obstacle Modifié');
          expect(res.body)
            .to.have.property('description')
            .with.equal(
              'Un super obstacle avec une belle description Modifiée'
            );
          expect(res.body).to.have.property('distance').with.equal(0.4);

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });
  });
});
