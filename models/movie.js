// mongoose to connect to mongoDB
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    // defining different columns of our schema
    // they are JSON objects
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    releaseYear:{
        type: Date,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    // for recently added to be in order from most recent one to least recent one
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName:{
        type: String,
        required: true
    },
    director:{
        // referencing another object inside of our collections
        type: mongoose.Schema.Types.ObjectId,
        // every movie has its director
        required: true,
        // since we're referencing something else (ObjectId), we need to tell mongoose what
        // we're referencing
        ref: 'Director'
    }
})

// name of the table (schema)
module.exports = mongoose.model('Movie', movieSchema)