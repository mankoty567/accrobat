const { app } = require('../serveur');

const global = require('./hooks').global;

let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Segment', function () {
  describe('POST /api/segment', () => {
    it('Mauvais Body', (done) => {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (
        global.start_point_id === undefined ||
        global.middle_point_id === undefined
      ) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/segment/')
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

    it("PointPassage n'existent pas", (done) => {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/segment/')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          PointStartId: -1,
          PointEndId: -2,
          path: [[0.2, 0.2]],
          name: 'Premier Segment',
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

    it('Création de Segment', (done) => {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (
        global.start_point_id === undefined ||
        global.middle_point_id === undefined
      ) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/segment/')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          PointStartId: global.start_point_id,
          PointEndId: global.middle_point_id,
          path: [[0.2, 0.2]],
          name: 'Premier Segment',
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          global.segment_id = res.body.id;

          expect(res.body)
            .to.have.property('name')
            .with.equal('Premier Segment');
          expect(res.body)
            .to.have.property('PointStartId')
            .with.equal(global.start_point_id);
          expect(res.body)
            .to.have.property('PointEndId')
            .with.equal(global.middle_point_id);

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

      if (
        global.end_point_id === undefined ||
        global.middle_point_id === undefined
      ) {
        this.skip();
      }

      let res1 = await chai
        .request(app)
        .post('/api/segment/')
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          PointStartId: global.middle_point_id,
          PointEndId: global.end_point_id,
          path: [[0.6, 0.6]],
          name: 'Segment Segment',
        });

      global.segment_2_id = res1.body.id;

      expect(res1.status).to.equal(200);
    });
  });

  describe('POST /api/segment/:id', () => {
    // Passe pas
    it("Segment qui n'existe pas", function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/segment/-1')
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

    it('Modification de segment', function (done) {
      if (global.jwt_admin === undefined) {
        this.skip();
      }

      if (global.segment_id === undefined) {
        this.skip();
      }

      chai
        .request(app)
        .post('/api/segment/' + global.segment_id)
        .set('Authorization', 'Bearer ' + global.jwt_admin)
        .send({
          name: 'Premier Segment Modifié',
        })
        .then(function (res) {
          expect(res.status).to.equal(200);

          expect(res.body)
            .to.have.property('name')
            .with.equal('Premier Segment Modifié');

          done();
        })
        .catch(function (err) {
          console.log(err);
          throw err;
        });
    });
  });
});
