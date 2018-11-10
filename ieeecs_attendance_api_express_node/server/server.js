const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const middleWare = require('express-list-middleware');
const verifyPost = require('./verifyPost.js');

let db;
const app = express();
const port = 3000;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json())

MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost/').then(client => {
	return client.db('IEEECS_Attendance');
}).then(connection => {
	console.log(middleWare());
	db = connection;
	app.listen(port, () => {
		console.log('App started on port ' + port);
	});
}).catch(error => {
	console.log('ERROR:', error);
});

//#region GET 

app.get(`/api/attendance/:ePantherID`, (req, res) => {
	db.collection('present_students').find({ePantherID:req.params.ePantherID}).toArray().then(students => {
		const metadata = { total_count: students.length };
        console.log(req.params.ePantherID);
        res.json({ _metadata: metadata, records: students});
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}`});
	});
});

app.get(`/api/attendance/year/:year`, (req, res) => {
	db.collection('present_students').find({year:Number(req.params.year)}).toArray().then(students => {
        const metadata = { total_count: students.length };
        console.log(`\nyear = ${req.params.year} \nmonth = ${req.params.month} \nday = ${req.params.day}`);
		res.json({ _metadata: metadata, records: students})
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}`});
	});
});

app.get(`/api/attendance/year/:year/month/:month`, (req, res) => {
	db.collection('present_students').find({year:Number(req.params.year), month:Number(req.params.month)}).toArray().then(students => {
        const metadata = { total_count: students.length };
        console.log(`\nyear = ${req.params.year} \nmonth = ${req.params.month} \nday = ${req.params.day}`);
		res.json({ _metadata: metadata, records: students})
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}`});
	});
});

app.get(`/api/attendance/year/:year/month/:month/day/:day`, (req, res) => {
	db.collection('present_students').find({year:Number(req.params.year), month:Number(req.params.month), day:Number(req.params.day)}).toArray().then(students => {
        const metadata = { total_count: students.length };
        console.log(`\nyear = ${req.params.year} \nmonth = ${req.params.month} \nday = ${req.params.day}`);
		res.json({ _metadata: metadata, records: students})
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}`});
	});
});

app.get(`/api/attendance`, (req, res) => {
	db.collection('present_students').find().toArray().then(students => {
		const metadata = { total_count: students.length };
		res.json({ _metadata: metadata, records: students})
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}`});
	});
});

//#endregion GET


//#region POST

app.post('/api/attendance', (req, res) => {
    const newCheckIn = req.body;

    console.log(`\nreq.body = ${req.body.params}\n`)
     
	//console.log(newCheckIn);
	
	const err = verifyPost(newCheckIn);
	if(err) {
		res.status(422).json({message: `Invalid request; ${err}`});
		return;
	}

	db.collection('present_students').update(
			{
				ePantherID:newCheckIn.ePantherID, 
				year:Number(newCheckIn.year), 
				month:Number(newCheckIn.month), 
				day:Number(newCheckIn.day)
			}, 
			newCheckIn, {upsert:true}).then(result => 
        db.collection('present_students').find({_id: result.insertedId}).limit(1).next()
    ).then(newCheckIn => {
        res.json(newCheckIn);
    }).catch(error => {
        console.log(error);
        res.status(500).json({message: `Internal Server Error: ${error}`});
    });
});

//#endregion POST



