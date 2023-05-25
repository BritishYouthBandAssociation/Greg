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

	async #postForJson(endpoint, data){
		const headers = this.#getHeaders();
		headers['Content-Type'] = 'application/json';

		return await fetchJson(`${this.#config.server}/wp-json/wp/v2/${endpoint}`, {
			headers,
			method: 'POST',
			body: JSON.stringify(data)
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

	async uploadFile(blob, name, mime){
		const headers = this.#getHeaders();
		headers["Content-Disposition"] = `attachment; filename="${name}"`;
		headers["Content-Type"] = mime;

		return await fetch(`${this.#config.server}/wp-json/wp/v2/media`, {
			method: 'POST',
			headers,
			body: blob
		}).then(res => res.json());
	}

	async setFeaturedImage(postId, mediaId){
		return await this.#postForJson(`posts/${postId}`, {
			featured_media: mediaId
		});
	}

	async uploadFeaturedMedia(postId, blob, name, mime){
		const media = await this.uploadFile(blob, name, mime);
		return await this.setFeaturedImage(postId, media.id);
	}

	async setPostStatus(postId, status){
		return await this.#postForJson(`posts/${postId}`, {
			status
		});
	}
}

module.exports = WordPressHelper;