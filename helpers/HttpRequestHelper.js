'use strict';

class HttpRequestHelper{
	static async fetchJson(url, opts){
		return await fetch(url, opts).then(res => res.json());
	}
}

module.exports = HttpRequestHelper;