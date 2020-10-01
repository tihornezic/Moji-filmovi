const express = require('express')
const router = express.Router()

// for multer
const multer = require('multer')
// node.js built in path
const path = require('path')

// built in node library
// file system library
// used for not allowing saving cover image if the error occured
// delete cover images we don't need anymore
const fs = require('fs')

const Movie = require('../models/movie')
const Director = require('../models/director')

// uploadPath is going to go from public folder into coverImageBasePath
const uploadPath = path.join('public', Movie.coverImageBasePath)
// array of all different image types that we accept
// always default, always same for server: 
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
// 

const upload = multer({
    // where the upload is going to be
    // we don't want to hardcode it, but to come from movie model
    dest: uploadPath, // is basically 'public/uploads/movieCovers'
    // to filter which files server accepts
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


// all movies route
router.get('/', async (req, res) => {
    // if we pass Movie.find() with no parameters, this returns to us a query object
    // which we can then build a query from and then execute later
    // and we want to build this query from our request query parameters
    let query = Movie.find()
    // query of a title
    if(req.query.title != null && req.query.title != ''){
        // 'title' is db model parameter so esentially movie.title object of our db
        // regular expression contains title and ignors capital or loweracase
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    // filter for publishedBefore
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        // .lte - less than or equal to
        // if the releaseYear <= publishedBefore
        // then we want to return that object
        query = query.lte('releaseYear', req.query.publishedBefore)
    }
    // filter for publishedAfter
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        // .gte - greater than or equal to
        // if the releaseYear >= publishedBefore
        // then we want to return that object
        query = query.gte('releaseYear', req.query.publishedAfter)
    }
    try {
        // executes query above defined
        // instead of const book = await Book.find({})
        const movies = await query.exec()
        res.render('movies/index', {
            movies: movies,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }

})

// new movie route
router.get('/new', async (req, res) => {
    // no hasError parameter needed, because we're never going to have an error on this new page
    renderNewPage(res, new Movie())
})


// create movie route
// ('cover') what we set to be the input name in _form_fiels.ejs...\movies
// we're telling molter we are uploading a single file with the name of cover
// it's going to do all work behind the scenes for us to create that file and
// upload it to the server and put it the correct folder
    // '/' is the meaning of the route at which you are listening for the request
router.post('/', upload.single('cover'), async (req, res) => {
    // this library is also going to add a variable to our request which is file
    // we're getting file name from the file if it exists and give it that name
    const fileName = req.file != null ? req.file.filename : null
    // new movie object
    const movie = new Movie({
        // setting default values ?OR? creating new movie object ??? 
        title: req.body.title,
        director: req.body.director,
        // converting string date into actual date using new Date
        releaseYear: new Date(req.body.releaseYear),
        duration: parseInt(req.body.duration),
        // for cover image we first need to create cover image file on our file system
        // then get the name from that and then save that into movie object
            // for that we're gonna use library multer (multi part forms)
                // if we uploaded a file fileName is going to be equal to the name of that file
                // but if not, it will be null, so we can send error msg
        coverImageName: fileName,
        description: req.body.description
        // entire movie object created, now saving it:
    })
    // saving a movie
    try {
        const newMovie = await movie.save()
        // res.redirect(`movies/${newMovie.id}`)
        res.redirect(`movies`)
    } catch {
        // 
        if (movie.coverImageName != null) {
            removeBookCover(movie.coverImageName)
        }
        // passing existing movie object
        // hasError = true because we are in catch section which is for handling errors
        renderNewPage(res, movie, true)
    }
})

// function for removing cover image files which we don't want on our server
function removeBookCover(fileName) {
    // remove the file we don't want on our server
    // gets rid of any file that has the file name inside of movieCovers folder
    // we wanna pass it the path where this file is at
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, movie, hasError = false) {
    try {
        const directors = await Director.find({})
        // to dynamically create error message
        // parameters we're sending to the server
        const params = {
            directors: directors,
            movie: movie
        }
        if (hasError) params.errorMessage = 'Error Creating Movie'
        res.render('movies/new', params)
    } catch {
        res.redirect('/movies')
    }
}

// exporting router
module.exports = router