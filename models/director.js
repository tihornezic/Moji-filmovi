// mongoose to connect to mongoDB
const mongoose = require('mongoose')

const directorSchema = new mongoose.Schema({
    // defining different columns of our schema
    // they are JSON objects
    name:{
        type: String,
        required: true
    }
})

// name of the table (schema)
module.exports = mongoose.model('Director', directorSchema)