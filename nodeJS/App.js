// ************************ FILES ************************
const fs = require('fs');

const userDataPath = 'user-data.txt';

fs.writeFile(userDataPath, 'username=Pavlo', err => {
	err ? console.log(err) : console.log('Wrote to file!');
});

fs.readFile(userDataPath, (err, data) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(`${userDataPath} data =>`, data.toString());
});

// ************************ HTTP in old-school way ************************
const http = require('http');

const httpServer = http.createServer((request, response) => {
	let body = [];
	request.on('data', chunk => {
		body.push(chunk);
	});
	request.on('end', () => {
		body = Buffer.concat(body).toString();
		let userName = '';
		if (body) {
			userName = body.split('=')[1];
		}
		response.setHeader('Content-Type', 'text/html');
		response.write(
			`<h1>Hi ${userName}</h1><form method="POST" action="/"><input name="username" type="text"/><button type="submit">Send</button></form>`
		);
		response.end();
	});
});

if (!process.env.PORT) {
	httpServer.listen(3000, () => {
		console.log('Server for HTTP testing is running on http://localhost:3000/');
	});
}

// ************************ HTTP with Express.js ************************
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// each use() is a middleware
// use() order matters! executes one by one in given order
app.use((request, response, next) => {
	response.setHeader('Contenty-Type', 'text/html');
	// execute next use() middleware
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, response) => {
	const userName = request.body.username || '';
	response.render('index', {
		user: userName,
	});
});

if (!process.env.PORT) {
	app.listen(3001, () => {
		console.log(
			'Server for Express.js testing is running on http://localhost:3001/'
		);
	});
}

// ************************ REST (For Share My Place app) ************************
const mongoSanitize = require('express-mongo-sanitize');
const locationRoutes = require('./routes/Location');

const appRest = express();
// Sanitize user input as a security measure to prevent NoSQL injections
appRest.use(mongoSanitize());
appRest.use(bodyParser.json());

// Set CORS policies
appRest.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

appRest.set('view engine', 'ejs');
appRest.set('views', 'views');

appRest.use(locationRoutes);

appRest.use((request, response, next) => {
	response.setHeader('Contenty-Type', 'text/html');
	response.render('shareMyPlaces');
	next();
});

const appRestPort = process.env.PORT || 3002;

appRest.listen(appRestPort, () => {
	console.log(`Server for REST testing is running on PORT ${appRestPort}`);
});
