
var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	classSchema = new schema({
		name: String,
		classTeacher: String,
		sections: String,
		subjects: String,
		createdAt: Date,
		updatedAt: Date,
		isActive: Boolean
	});

module.exports = mongoose.model('classs',classSchema);