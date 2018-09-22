db = new Mongo().getDB('IEEECS_Attendance');

// schema validation source : https://docs.mongodb.com/manual/reference/method/db.createCollection/
// may have to do command manually 
db.createCollection( "present_students", {
    validator: { $jsonSchema: {
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
            major:{
                bsonType : "string", 
                description: "must be a string"
            },
            dateEntered: {
                bsonType: "date", 
                description: "must be a date type and is required"
            },
            year:{
                bsonType: "int", 
                minimum: 2018, 
                maximum: 2050, 
                exclusiveMaximum: false, 
                description: "must be an integer in [2018, 2050] and is required"
            },
            month:{
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
        } }
    } );

    db.present_students.insert([
        {ePantherID:"hartmut", name:"hart", major:"compsci", date:new Date(), year:NumberInt(2018), month:NumberInt(9), day:NumberInt(22)},
        {ePantherID:"jbrumm", name:"jon", major:"lit ed", date:new Date(), year:NumberInt(2018), month:NumberInt(9), day:NumberInt(23)}
    ]);

 db.present_students.createIndex({ ePantherID: 1});
 db.present_students.createIndex({ name: 1});
 db.present_students.createIndex({ major: 1});
