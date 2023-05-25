'use strict';

const express = require('express');
const WordPressHelper = require("../helpers/WordPressHelper");

const { downloadFile } = require("../helpers/HttpRequestHelper");
const {stripTags } = require("../helpers/TextHelper");

const wpConfig = require("../config/wordpress.json");
const wpHelper = new WordPressHelper(wpConfig);
const router = express.Router();

router.get("/new-post/:id", async (req, res) => {
	const post = await wpHelper.getPost(req.params.id);
	
	if(post.status != "pending"){
		res.status(400).send(`Expected status to be 'pending' but got '${post.status}'`);
		return;
	}
	
	const title = encodeURIComponent(stripTags(post.title.rendered));
	const excerpt = stripTags(post.content.rendered).split("\n")[0];
	const media = await wpHelper.getMedia(post.featured_media);

	if(!media?.guid?.rendered){
		res.status(400).send("Missing image!");
	}

	const [cover, newsImg] = await Promise.all([
		downloadFile(`https://dev.template.byba.online/wordpresscover?image=${media.guid.rendered}`),
		downloadFile(`https://dev.template.byba.online/squarenews?image=${media.guid.rendered}&text=${title}`)
	]);

	await wpHelper.uploadFeaturedMedia(post.id, cover, post.title.rendered + ".png", "image/png");
	await wpHelper.updatePost(post.id, {
		status: 'publish',
		excerpt
	});

	res.type("image/png");
	res.send(newsImg);
});

module.exports = {
	root: '/wordpress',
	router: router
};