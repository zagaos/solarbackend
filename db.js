const express = require('express');
const app = express();

const mqtt = require('mqtt');
let topic_list = '/name';
let topic2 = '/battery';
let client  = mqtt.connect('mqtt://test.mosquitto.org');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

var dataBase;

// Server Creation //
server = app.listen(8081, () => {
    console.log("HTTP is Running");

    MongoClient.connect(url,(err,db) => {
        if (err){
            console.log("DB is not connected");
        }
        dataBase = db.db('Solar_Analysis');
    })

    client.on('connect',() => {
        client.subscribe(topic_list);
    })


    client.on('message', (topic_list,message) => {
        let Data_to_save = {recieved:message.toString()};
        console.log("message_received",Data_to_save);
        dataBase.collection('Solar').insertOne({"Panel":Data_to_save},(err,res) => {
            if (err){
                console.log("Data Not yet to be stored");
            }
        })
        })
    
    // client.on('connect',() => {
    //     client.subscribe(topic2);
    // })

//     client.on('message2',(topic2,message2) => {
//         let Battery_Data = {recieved:message2.toString()};
//         console.log("battery_msg",Battery_Data);
//         dataBase.collection('Solar').insertOne({"Battery":Battery_Data},(err,res) => {
//             if (err){
//                 console.log("Data Not yet to be stored");
//             }
//     })
// })
})
app.get('/Database',(req,res) => {
    dataBase.collection('Solar').find({}).toArray(function(err,result) {
        if(err){
            console.log("Data Does not found");
        }
        res.send(result);
    })
});
