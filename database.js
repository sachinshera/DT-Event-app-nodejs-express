// initilize database
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://sachin:sachin@cluster0.9x3ucir.mongodb.net/?retryWrites=true&w=majority';
const databaseName = 'eventsApp';
const client = new MongoClient(url, { useNewUrlParser: true });
const db = client.db(databaseName);
client.connect(function (err) {
    if (err) throw err;
    console.log("Database connected!");
});
// export database
module.exports = db;



