// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const {TEST_DATABASE_URL} = require('../config');
//
// const {app, runServer, closeServer} = require('../server');
//
// const should = chai.should();
//
// chai.use(chaiHttp);
//
//
// describe('root test', function() {
//   before(function() {
//     return runServer(TEST_DATABASE_URL);
//   });
//
//   after(function() {
//     return closeServer(TEST_DATABASE_URL);
//   });
//
//   it('should display html on GET', function() {
//     return chai.request(app)
//     .get('/')
//     .then(function(res) {
//       res.should.have.status(200);
//       res.should.be.html;
//     });
//   });
// });
