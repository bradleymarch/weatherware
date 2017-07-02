const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcryptjs');
const should = chai.should();
const {User} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedUserData() {
	const username = 'testuser';
	const password = 'password';
	const seedData = [];

	for (let i=1; i<=10; i++) {
		seedData.push(generateUserData());
	}

	// set one record with known username and password for testing log in
	seedData[5].username = username;
	seedData[5].password = password;
	const hashedPassword = bcrypt.hash(password, 10);
	return hashedPassword
	.then(_hashedPassword => {
		seedData[5].password = _hashedPassword;
		console.warn('\n Seeding database');
		return User.create(seedData);
	})
}



function generateUserData() {
	return {
		username: faker.internet.userName(),
		password: faker.internet.password(),
		settings: {

			location: "12345",
			tempSensitivity: {type: faker.string(), default: "test"},

		}
	}
}

function tearDownDb() {
	console.warn('Deleting database\n');
	return mongoose.connection.dropDatabase();
}

describe('Users API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedUserData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	
	describe('POST endpoint for login', function() {

		it('should login user and return user account', function() {
			let res;
			let agent = chai.request.agent(app);
			return agent
			.post('/users/login')
			.auth('testuser', 'password')
			.then(_res => {				
				res = _res;
				res.should.have.status(200);
				res.body.user.username.should.equal('testuser');
				res.body.user.should.include.keys(
					'username', 'password');
			})
		});
	});

	describe('GET endpoint to logout', function() {

		it('should sign out the user and redirect', function() {
			let agent = chai.request.agent(app);
			return agent
				.get('/users/logout') // first have to log in
				.auth('testuser', 'password')
				.then(() => {				
					return agent.get('/users/logout')
					.then(res => {
						res.should.have.status(200);
						res.redirects.should.have.lengthOf(1);							
					})					
				});
			});
	});

	describe('POST endpoint to create new user', function() {

		it('should create a new user', function() {

			let testUsername = 'testuser2010';
			let testPassword = 'password123';
			
			return chai.request(app)
			.post('/users/register')
			.send({username: testUsername, password: testPassword})
			.then(res => {							
				res.should.have.status(201);
				res.body.user.username.should.equal(testUsername);
				res.body.user.should.include.keys(
					'username', 'password');			
				User.findOne({username: testUsername})
				.then(user => {
					user.should.exist;
					user.username.should.equal(testUsername);
				})
			});
		});
	});
});
describe('PUT endpoint to update settings', function() {

		it('should save changes settings', function() {
			let agent = chai.request.agent(app);
			let testEntry = {
		        username: 'yeah',
		        password: 'ok',
		        settings: {
		        	tempSensitivity: "Always cold",
		        	location: "12345",
		        }
		        
        				}
			return agent
				.get('/users/login') // first have to log in
				.auth('testuser', 'password')
				.then((res) => {
					testEntry.id = res.body.user.adjustmentEntries[0].id; // gets id of entry to change				
					return agent
						.put('/users/settings')
						.send(testEntry)
						.then(res => {
							let resEntry = res.body.user.adjustmentEntries[0]
							res.should.have.status(200);
							resEntry.username.should.equal(testEntry.username);
							resEntry.password.should.equal(testEntry.password);
							resEntry.settings.should.equal(testEntry.settings);
							
							return User
								.findOne({username: 'testuser'})
								.then(user => {
									let entry = user.adjustmentEntries[0];
									entry.username.should.equal(testEntry.username);
									entry.password.should.equal(testEntry.password);
									entry.settings.should.equal(testEntry.settings);
									
								})		
						});			
				});
		});
	});
describe('DELETE endpoint for user account', function() {

		it('should delete the user account', function() {
			let agent = chai.request.agent(app);
			return agent
				.get('/users/login') // first have to log in
				.auth('testuser', 'password')
				.then(() => {				
					return agent
						.delete('/users/_id')
						.then(res => {
							res.should.have.status(200);
							return User
								.findOne({username: 'testuser'})
								.then(res => {
									should.not.exist(res);
								})
						})					
				});
		});
	});