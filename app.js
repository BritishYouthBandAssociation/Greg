'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

const express = require('express');
const formData = require('express-form-data');

function loadRoutes(server, routeDir){
	const routes = fs.readdirSync(routeDir).filter(file => file.endsWith('.js'));

	routes.forEach(r => {
		const route = require(path.join(routeDir, r));
		server.use(route.root, route.router);
	});
}

const server = new express();
server.use(express.json());
server.use(express.urlencoded({
	extended: true
}));

loadRoutes(server, path.join(__dirname, "routes"));

server.use(formData.parse({
	uploadDir: os.tmpdir(),
	autoclean: true
}));

server.use(formData.format());

server.listen(81, () => {
	console.log("Server is up!");
});