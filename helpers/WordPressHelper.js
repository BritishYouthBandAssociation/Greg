'use strict';

const { fetchJson } = require("./HttpRequestHelper");

class WordPressHelper{
	#config = null;

	constructor(config){
		this.#config = config;
	}

	async #requestJson(endpoint){
		const headers = this.#getHeaders();
		return await fetchJson(`${this.#config.server}/wp-json/wp/v2/${endpoint}`, {
			headers
		});
	}

	#getHeaders(){
		return {
			'Authorization': 'Basic ' + Buffer.from(`${this.#config.username}:${this.#config.password}`).toString("base64")
		};
	}

	async getPost(postID){
		return await this.#requestJson(`posts/${postID}`);
	}

	async getMedia(mediaID){
		return await this.#requestJson(`media/${mediaID}`);
	}
}

module.exports = WordPressHelper;