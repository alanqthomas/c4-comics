"use strict";

function createUser(id, email, picture){
	return {
		userID: id,
		email:email,
		username:email,
		biography:"Write a biography here!",
		profileImageURL:picture,
	}
}
function createSeries(authorId){
	return {
		authorId: authorId,
		description:"Write a description here!",
	}
}