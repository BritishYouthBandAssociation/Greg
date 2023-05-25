'use strict';

class HttpRequestHelper{
	static async fetchJson(url, opts){
		return await fetch(url, opts).then(res => res.json());
	}

	static async downloadFile(url){
		return await fetch(url).then(result => result.blob()).then(blob => blob.arrayBuffer()).then(buf => Buffer.from(buf));
	}
}

module.exports = HttpRequestHelper;