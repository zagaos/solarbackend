const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;
//local
const url =   "mongodb://localhost:27017/Solar_Analysis" ; 

var dataBase ;

var mqtt = require('mqtt');

//remote 
var mqClient  = mqtt.connect('mqtt://mqtt.dioty.co:1883' , {
username : 'otsolutionspvt@gmail.com',
password : '5ac4a9c9'
});

server  = app.listen(8081 ,function(){
    var host =  server.address().address;
    var port = server.address().port;
    console.log("my api server is running at http", host , port);

    MongoClient.connect(
        url,(error , Db) => {
    if (error){
        console.log("db connnection error");
    }
    dataBase =  Db.db("Solar_Analysis");
    // collection=db.collection("Solar");
    console.log('im here in start of mqtt');

    mqClient.subscribe('/otsolutionspvt@gmail.com/solar', function (err) {
        if(err){
            console.log('mqtt error');
        }
        console.log('mqtt no error ');

        Db.on('message', function (topic , message , packet) {
            console.log('received mess' +  JSON.parse (message ) + " on " + topic);
            dataBase.collection("Solar").insertOne();
          })
            
       
      });
    
}
);
});
    

//api
app.get('/getmydata', function (req, res) {
    res.send('Hello World')
  });

  app.get('/solarPanelData', function (req, res) {
      //mongodb 
    dataBase =  client.db("Solar_Analysis");

    const collectionData = dataBase.collection("Solar");
    collectionData.find({}).toArray( function(error , result) {
        res.send(result);

    });
   
  });