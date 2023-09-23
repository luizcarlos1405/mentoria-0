//First you have to open the MONGODBCOMPASS, put your URI on the mongo.js and docker-compose
//Second you have to create the docker-compose.yaml and run with the comand: docker-compose up -d
//On the docker-compose mongoexpress dont put all the URI from the mongodbcompass put only mongodb://mentoria:mentoria@mongo:27017/, or will bug
//do not erase the docker-mongo or you will lose all information on MongoDB compass
//third import mongoose to help you create schema and export the collection
//fourth put the schema on the post on you express
//enjoy


import mongoose from "mongoose";
const uri = "mongodb://localhost:27017/mentoria";//if you want to change the db name just put some name after / 

mongoose.connect(uri).then(()=>{
    console.log('Mongo Online')
}).catch(()=>{
    console.log("Failed")
});

const userSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    
    msg:{
        type:String,
        required:true
    }
});

export const messagesCollection = new mongoose.model("Messages", userSchema);