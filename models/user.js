var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	login: String,
	password: String,
	name: String,
	role: Number,
	updated: {type: Date, default: Date.now}
}));