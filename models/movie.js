// mongoose to connect to mongoDB
const mongoose = require('mongoose')

// path where all cover movie images are going to be stored
// 
const coverImageBasePath = 'uploads/movieCovers'

const movieSchema = new mongoose.Schema({
    // defining different columns of our schema
    // they are JSON objects

    // naslov
    title:{
        type: String,
        required: true
    },
    // komentar/opis
    description:{
        type: String
    },
    // godina izlaska
    releaseYear:{
        type: Date,
        required: true
    },
    // trajanje
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
    // cover slika
    coverImageName:{
        type: String,
        required: true
    },
    // redatelj
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
// now this can be imported inside of movies route
module.exports.coverImageBasePath = coverImageBasePath