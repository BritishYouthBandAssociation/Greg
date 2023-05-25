'use strict';

class TextHelper{
	static stripTags(text){
		return text.replace(/(<([^>]+)>)/gi, "");
	}
}

module.exports = TextHelper;