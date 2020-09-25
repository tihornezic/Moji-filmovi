// mongoose to connect to mongoDB
const mongoose = require('mongoose')
const path = require('path')

// path where all cover movie images are going to be stored
// 
const coverImageBasePath = 'uploads/movieCovers'

const movieSchema = new mongoose.Schema({
    // defining different columns of our schema
    // they are JSON objects

    // naslov
    title: {
        type: String,
        required: true
    },
    // komentar/opis
    description: {
        type: String
    },
    // godina izlaska
    releaseYear: {
        type: Date,
        required: true
    },
    // trajanje
    duration: {
        type: Number,
        required: true
    },
    // for recently added to be in order from most recent one to least recent one
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    // cover slika
    coverImageName: {
        type: String,
        required: true
    },
    // redatelj
    director: {
        // referencing another object inside of our collections
        type: mongoose.Schema.Types.ObjectId,
        // every movie has its director
        required: true,
        // since we're referencing something else (ObjectId), we need to tell mongoose what
        // we're referencing
        ref: 'Director'
    }
})

// virtual property: act as any of these above
// but it will actually derive its value from those variables
// when we call movie.coverImagePath it's going to call this get function
// reason to using normal function instead of arrow function:
// we need to have access to this. property which is going to be linked to actual movie itself
// we need that direct path to where that cover image is uploaded (index.ejs...\movies)
movieSchema.virtual('coverImagePath').get(function () {
    // if there is a cover image, then we want to return path which leads to public\uploads\movieCovers
    if (this.coverImageName != null) {
        // to do this, we need path library
        // we want to our root of our object which is going to be inside that public folder
        // and we want to append this coverImageBasePath that we created above
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

// name of the table (schema)
module.exports = mongoose.model('Movie', movieSchema)
// now this can be imported inside of movies route
module.exports.coverImageBasePath = coverImageBasePath