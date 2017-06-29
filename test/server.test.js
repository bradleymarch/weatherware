const chai = require('chai');
const chaiHttp = require('chai-http');

const {app} = require('/server');
const {TEST_DATABASE_URL} = require('/config');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('first-test', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer(TEST_DATABASE_URL);
  });

  it('should display html on GET', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      });
  });
});
 /*describe('GET endpoint', function() {

    it('should GET forecast for set location', function() {
  
      let res;
      return chai.request(app)
        .get('/forecast')
        .then(function(_res) {
          // so subsequent .then blocks can access resp obj.
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.forecast.should.have.length.of.at.least(1);
          return Forecast.count();
        })
        .then(function(count) {
          res.body.forecast.should.have.length.of(count);
        });
    });


    it('should return forecast with right fields', function() {

      let resForecast;
      return chai.request(app)
        .get('/forecast')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.forecast.should.be.a('array');
          res.body.forecast.should.have.length.of.at.least(1);

          res.body.forecast.forEach(function(forecast) {
            forecast.should.be.a('object');
            forecast.should.include.keys(
              'location', 'time', 'temperature', 'description');
          });
          resForecast = res.body.forecast[0];
          return Forecast.findById(resForecast.id);
        })
        .then(function(restaurant) {

          resForecast.temp.should.equal(forecast.location);
          resForecast.time.should.equal(forecast.time);
          resForecast.temp.should.equal(forecast.temp);
          resForecast.description.should.equal(forecast.description);
          
        });
    });
  });
  describe('PUT endpoint', function() {


    it('should update location you send over', function() {
      const updateData = {
        location: 'Dallas, TX',
        
      };

      return Location
        .findOne()
        .exec()
        .then(function(location) {
          updateData.id = location.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/location/${location.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);

          return Location.findById(updateData.id).exec();
        })
        .then(function(forecast) {
          location.id.should.equal(updateData.id);

        });
      });
  });
*/



