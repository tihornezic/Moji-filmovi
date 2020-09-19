const mongoose = require('mongoose')

const directorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

// name of the table (schema)
module.exports = mongoose.model('Director', directorSchema)