// mongoose to connect to mongoDB
const mongoose = require('mongoose')
/* const path = require('path') */

// MULTER:
// path to where all cover movie images are going to be stored
// this 'uploads/movieCovers' below is going to be inside public folder
/* const coverImageBasePath = 'uploads/movieCovers' */

const movieSchema = new mongoose.Schema({
    // defining different columns of our schema
    // they are JSON objects

    // naslov
    title: {
        type: String,
        required: true
    },

    // žanr
    genre: {
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
    // instead of storing coverImageName, we just want to store the coverImage itself
    coverImage: {
        // buffer of the data representing our entire image, no longer string
        type: Buffer,
        required: true
    },
    // for indetifying image type
    coverImageType: {
        type: String,
        required: true
    },
    // redatelj
    // referencing director from our director collection model
    director: {
        // referencing another object inside of our collections
        // id of the director object
        type: mongoose.Schema.Types.ObjectId,
        // every movie has its director
        required: true,
        // since we're referencing something else (ObjectId), we need to tell mongoose what
        // we're referencing
        ref: 'Director'
    }
})

// for movies/index showing all movies from newest to oldest:
// virtual property: act as any of these above
// but it will actually derive its value from those variables
// when we call movie.coverImagePath it's going to call this get function
// reason to using normal function instead of arrow function:
// we need to have access to this. property which is going to be linked to actual movie itself
// we need that direct path to where that cover image is uploaded (index.ejs...\movies)

/* movieSchema.virtual('coverImagePath').get(function () {
    // if there is a cover image, then we want to return path which leads to public\uploads\movieCovers
    if (this.coverImageName != null) {
        // to do this, we need path library
        // we want to join our root of our object which is going to be inside that public folder
        // and we want to append this coverImageBasePath that we created above
        // '/' is route for object route folder which is public
        return path.join('/', coverImageBasePath, this.coverImageName) // public\uploads\movieCovers/coverImageName
    }
}) */

// image uploads, but doesn't show up
// fix:
// we need to convert coverImage and coverImageType to an actual usable source
// instead of above old way, for filepond to work use:
movieSchema.virtual('coverImagePath').get(function () {
    if (this.coverImage != null && this.coverImageType != null) {
        // we want to return the source of our image object
        // returns proper string for our image source in order to display image from our buffer
        // data object is a source for images allows us to take Buffer data and use it as source for images 
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

// name of the table (schema)
module.exports = mongoose.model('Movie', movieSchema)
/* module.exports.coverImageBasePath = coverImageBasePath */