'use strict';

const express = require('express');
const WordPressHelper = require("../helpers/WordPressHelper");

const wpConfig = require("../config/wordpress.json");

const wpHelper = new WordPressHelper(wpConfig);
const router = express.Router();

router.get("/new-post/:id", async (req, res) => {
	const post = await wpHelper.getPost(req.params.id);
	const excerpt = post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "");;

	if(post.status != "pending"){
		res.status(400).send(`Expected status to be 'pending' but got '${post.status}'`);
		return;
	}

	const media = await wpHelper.getMedia(post.featured_media);

	console.log(media.guid.rendered);
	console.log(excerpt);

	const [cover, newsImg] = await Promise.all([
		fetch(`https://dev.template.byba.online/wordpresscover?image=${media.guid.rendered}`).then(result => result.blob()),
		fetch(`https://dev.template.byba.online/squarenews?image=${media.guid.rendered}&text=${excerpt}`).then(result => result.blob())
	]);

	res.type(newsImg.type);
	newsImg.arrayBuffer().then(buf => res.send(Buffer.from(buf)));
});

module.exports = {
	root: '/wordpress',
	router: router
};