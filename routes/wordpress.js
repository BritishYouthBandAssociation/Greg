'use strict';

const express = require('express');

const wpConfig = require("../config/wordpress.json");

const router = express.Router();

router.get("/new-post/:id", async (req, res) => {
	const json = await fetch(`${wpConfig.server}/wp-json/wp/v2/posts/${req.params.id}`, {
		headers: {
			'Authorization': 'Basic ' + Buffer.from(`${wpConfig.username}:${wpConfig.password}`).toString("base64")
		}
	}).then(result => result.json());

	res.json(json);
});

module.exports = {
	root: '/wordpress',
	router: router
};