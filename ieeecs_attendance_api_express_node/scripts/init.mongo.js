const { MONGODB_URI } = require('../env');
const { MongoClient } = require('mongodb');
let collection;

const sample_data = [
  {ePantherID:"hartmut", name:"hart", major:"compsci", date:new Date(), year:2018, month:9, day:22},
  {ePantherID:"jbrumm", name:"jon", major:"lit ed", date:new Date(), year:2018, month:9, day:23}
];

MongoClient.connect(MONGODB_URI)
  .then(client => client.db())
  .then(db =>
    db.createCollection( "present_students", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [ "ePantherID", "date"],
          properties: {
            ePantherID: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            name: {
              bsonType : "string",
              description: "must be a string"
            },
            major: {
              bsonType : "string",
              description: "must be a string"
            },
            dateEntered: {
              bsonType: "date",
              description: "must be a date type and is required"
            },
            year: {
              bsonType: "int",
              minimum: 2018,
              maximum: 2050,
              exclusiveMaximum: false,
              description: "must be an integer in [2018, 2050] and is required"
            },
            month: {
              minimum: 1,
              maximum: 12,
              bsonType: "int",
              description: "must be an integer in [1,12] and is required"
            },
            day: {
              minimum: 1,
              maximum: 31,
              bsonType: "int",
              description: "must be an intger in [1,31] and is required"
            },
            presentationGrade: {
              enum: [ "A", "B", "C", "D", "F" ],
              description: "can only be one of the enum values"
            }
          }
        }
      }
    }))
  .then(col => { collection = col; return col; })
  .then(() => collection.insertMany(sample_data))
  .then(() => collection.createIndex({ePantherID: 1}))
  .then(() => collection.createIndex({name: 1}))
  .then(() => collection.createIndex({major: 1}))
  .then(() => { console.log('db initialized'); process.exit(); })
  .catch((err) => console.log('Something went wrong! ' + err))
