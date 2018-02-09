
var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	staffSchema = require('../database/schemas/staffSchema.js'),
	classSchema = require('../database/schemas/classSchema.js'),
	studentSchema = require('../database/schemas/studentSchema.js'); 

router.get('/',function (req,res,next) {
	res.render('api-home',{title: 'API Home @Express + Angular'});
});

router.route('/class')
	.get(function (req,res,next) {
		let withoutProjection = { 
			__v: false,
		}
		projection = {
			name:true,
		},
		options = {
			sort: {
				name:1
			}
		},
		staffList = [];

		staffSchema.find({isActive: true},projection,function(err,doc){
			if(err){
				next(err);
			}
			staffList = doc;
			
			classSchema.find({ isActive: true },withoutProjection,options,function (err,classs) {
				if(err){
					console.log(err);
				}

				classs.forEach(function(clsObj){
					let transient = _.findWhere(staffList,{id: clsObj.classTeacher});
					if(transient){
						clsObj['classTeacher'] = transient.name;
					}
				})
				res.json(classs);
			});
		});

	})
	.post(function (req,res,next) {
		
		if(req.body){
			let classs = new classSchema(req.body);
			classs.createdAt = new Date();
			classs.isActive = true;
			classs.save(function (err,doc) {
				if (err) {
					console.log(err);
				}
				res.json(doc);
			})
		}
	});
router.route('/class/:clsId')
	.get(function (req,res,next) {
		let clsId = req.params.clsId,
			withoutProjection = { 
				__v: false,
				createdAt: false,
				isActive: false,
			};

		if (clsId && clsId.length) {
			classSchema.findById(clsId,withoutProjection,function(err,doc){
				if(err){
					next(err);
				}
				res.json(doc);
			})
		}
	})
	.put(function (req,res,next) {
		let clsId = req.params.clsId;
		if(clsId && clsId.length && req.body){
			let classs = {
				name: req.body.name,
				classTeacher: req.body.classTeacher,
				sections: req.body.sections,
				subjects:req.body.subjects,
				updatedAt: new Date()
			};
			classSchema.findByIdAndUpdate(clsId,{ $set: classs},{new: true}, function(err,doc){
				if(err){
					next(err);
				}
				res.json(doc)
			})
		}
	})
	.delete(function (req,res,next) {
		let clsId = req.params.clsId;
		if (clsId && clsId.length) {
			classSchema.findByIdAndRemove(clsId,function(err,doc){
				if(err){
					next(err);
				}
				res.send({_id : clsId})
			})
		}
	})

router.route('/student')
	.get(function (req,res,next) {
		let withoutProjection = {
			__v : false
		},
		options = {
			sort: {
				name:1
			}
		};
		studentSchema.find({isActive : true},withoutProjection,options,function(err,docs){
			if(err){
				res.send(err);
			}
			res.json(docs);
		})
	})
	.post(function(req,res,next){
		console.log(req.body);
		if(req.body){
			let stdData = new studentSchema(req.body);
			stdData.isActive = true;
			stdData.createdAt = new Date();
			
			stdData.save(function(err,doc){
				if(err){
					res.send(err);
				}
				res.json(doc);
			});

		}
	})
router.route('/student/:studentId')
	.put(function(req,res,next){
		console.log(req.params);
		let studentId = req.params.studentId;
		if(req.params.studentId){
			let student = {
				name: req.body.name,
				age: req.body.age,
				dob: req.body.dob,
				email: req.body.email,
				contactno: req.body.contactno,
				address: req.body.address,
				class: req.body.class,
				section: req.body.section,
			};
			studentSchema.findByIdAndUpdate(studentId,{$set: student},{new: true},function(err,docs){
				if(err){
					next(err);
				}
				res.json(docs);
			})
		}
	})
	.delete(function(req,res,next){
		if(req.params.studentId){
			studentId = req.params.studentId;

			studentSchema.findByIdAndRemove(studentId,function(err,docs){
				if (err) {
					next(err);
				}
				res.send({_id : studentId});
			})
		}
	})

router.route('/staff')
	.get(function(req,res,next){
		let withoutProjection = {
				__v:false
			},
			options = {
				sort:{
					name:1
				}
			};
		staffSchema.find({isActive:true},withoutProjection,options,function(err,docs){
			if(err){
				next(err);
			}
			res.json(docs);
		})
	})
	.post(function(req,res,next){
		if(req.body && Object.keys(req.body).length ){
			let staff = new staffSchema(req.body);
			staff.createdDate = new Date();
			staff.isActive = true;
			console.log(staff);
			staff.save(function(err,doc){
				if (err) {
					next(err);
				}
				res.json(doc);
			})
		}
	})
router.route('/staff/:staffId')
	.get(function(req,res,next){
		if(req.params.staffId){
			let staffId = req.params.staffId,
				withoutProjection = {
					__v : false,
					isActive:false,
					updatedAt:false,
					createdDate:false
				};
			if(staffId && staffId.length){
				staffSchema.findById(staffId,withoutProjection,function(err,docs){
					if (err) {
						next(err);
					}
					res.json(docs);
				})
			}
		}
	})
	.put(function(req,res,next){
		if(req.params.staffId){
			let staffId = req.params.staffId,
				staff = req.body;
			staff.updatedAt = new Date();
			console.log(staff);
			if(staffId){
				staffSchema.findByIdAndUpdate(staffId,{$set: staff},{new: true},function(err,docs){
					if(err){
						console.log(err);
					}
					res.json(docs);
				})
			}
		}
	})
	.delete(function(req,res,next){
		if(req.params.staffId){
			let staffId = req.params.staffId;
			staffSchema.findByIdAndRemove(staffId,function(err,docs){
				if(err){
					next(err);
				}
				res.json({_id: staffId});
			})
		}
	})

router.get('/students/attr',function(req,res,next){
	let data = {},
		withoutProjection = {
			__v:false,
			updatedAt:false,
			isActive:false
		},
		options = {
			sort:{
				name:1
			}
		};
	studentSchema.find({isActive:true},withoutProjection,options,function(err,docs){
		if(err){
			next(err);
		}
		data['students'] = docs;
		data['count'] = docs.length;
		res.json(data);
	})
})

router.get('/staffs/attr',function(req,res,next){
	let data = {},
		withoutProjection = {
			__v:false,
			updatedAt:false,
			password:false,
			isActive:false,
		},
		options = {
			sort:{
				dob:1
			}
		};

	staffSchema.find({isActive:true},withoutProjection,options,function(err,doc){
		if(err){
			next(err);
		}
		data['staffs'] = doc;
		data['count'] = doc.length;
		res.json(data);
	})
})

router.get('/classes/attr',function(req,res,next){
	let data = {},
		withoutProjection = {
			__v:false,
			isActive:false,
			updatedAt:false
		},
		projection = {
			name:true
		},
		options = {
			sort:{
				name:1
			}
		},
		staffList = [];

	staffSchema.find({isActive:true},projection,function(err,docs){
		if(err){
			next(err);
		}
		staffList = docs;

		classSchema.find({isActive:true},withoutProjection,options, function(err,classes){
			if(err){
				next(err);
			}

			if(classes.length){
				classes.forEach(function(clsObj){
					let transient = _.findWhere(staffList,{id:clsObj.classTeacher});
					if(transient){
						clsObj['classTeacher'] = transient.name;
					}
				})
			}

			data['classs'] = classes;
			data['count'] = classes.length;
			res.json(data);
		})
	})

})

router.get('/fetch/staff/:stcode',function(req,res,next){
	if(req.params.stcode){
		let stcode = req.params.stcode,
			projection = {
				name:true,
				type:true
			},
			options = {
				sort:{
					name:1
				}
			};
		staffSchema.find({type:stcode ,isActive:true},projection,options,function(err,docs){
			if(err){
				console.log(err);
				next(err);
			}
			res.json(docs);
		})
	}
})

router.get('/fetch/countStudent/:type',function(req,res,next){
	let type = req.params.type,
		group;
	if(type){

		if(type==='class'){
			group = {
				'class': '$class'
			};
		}
		else if(type === 'cls-sec'){
			group = {
				'class': '$class',
				'section': '$section'
			};
		}
		if(group){
			studentSchema.aggregate(
				[{
					$match: {'isActive':true}
				},{
					$group:{
						_id: group,
						count: {$sum:1}
					}
				},{
					$sort:{ '_id':1 }
				},{
					$project:{ groupOn: '$_id', count:1, _id:0 }
				}],function(err,result){
					if(err){
						next(err);
					}
					res.json(result);
			})
		}
		else{
			res.json({'msg':"undefined type params"});
		}
	}
})

router.get('/fetch/countCT/:type',function(req,res,next){
	let type = req.params.type,
		clsTchrIdList = [],
		projection;
	if(type){
		if(type==='cls-tchr'){

		}

		classSchema.aggregate([
				{
					$match:{
						'isActive': true
					}
				},{
					$group:{
						_id: '$classTeacher',
						count: { $sum:1 },
						classList: { $push: '$name' }
					}
				},{
					$project: {
						clsTchrId: '$_id',
						count: 1,
						classList: 1,
						_id: 0
					}
				}
			],function(err,result){
				if(err){
					next(err);
				}

				if(!_.isEmpty(result)){
					result.forEach(function(rs){
						if(rs.clsTchrId && _.findIndex(clsTchrIdList,rs.clsTchrId) === -1){
							clsTchrIdList.push(rs.clsTchrId);
						}
					})
				}
				projection = {
					name:1
				};

				staffSchema.find({ 'isActive':true, '_id':{ $in: clsTchrIdList } },projection,function(err,docs){
					if(err){
						next(err)
					}

					result.forEach(function(rs,key){
						let transient = _.findWhere(docs,{'id':rs.clsTchrId});
						result[key].tchrName = transient.name;
						rs.classList = rs.classList.join(",");
					})

					res.json(result);
				})

		})
		//res.json({msg: 'undefined type params'})
	}
})

module.exports = router;