
var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	staffSchema = new schema({
		name: String,
		dob: String,
		address: String,
		contact: String,
		email: String,
		password: String,
		type: String,
		joinedDate: String,
		createdDate: Date,
		updatedDate: Date,
		isActive: Boolean,
	});

module.exports = mongoose.model('staff',staffSchema);