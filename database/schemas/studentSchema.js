
var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	studentSchema = new schema({
		name:String,
		age:String,
		dob:String,
		email:String,
		contactno:String,
		address:String,
		class:String,
		section:String,
		isActive:Boolean,
		createdAt:Date,
		updateAt:Date
	});

module.exports = mongoose.model('student',studentSchema);