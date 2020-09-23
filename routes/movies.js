const express = require('express')
const router = express.Router()

// for multer
const multer = require('multer')
// node.js built in path
const path = require('path')

// built in node library
// file system library
const fs = require('fs')

const Movie = require('../models/movie')
const Director = require('../models/director')
const { render } = require('ejs')

// uploadPath is going to go from public folder into coverImageBasePath
const uploadPath = path.join('public', Movie.coverImageBasePath)
// array of all different image types that we accept
// always default, always same for server: 
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
// 

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


// all movies route
router.get('/', async (req, res) => {
    res.send('All movies')
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
router.post('/', upload.single('cover'), async (req, res) => {
    // this library is also going to add a variable to our request
    // we're getting file name from the file if it exists and give it that name
    const fileName = req.file != null ? req.file.filename : null
    // new movie object
    const movie = new Movie({
        // setting default values
        title: req.body.title,
        director: req.body.director,
        // converting string date into actual date using new Date
        releaseYear: new Date(req.body.releaseYear),
        duration: parseInt(req.body.duration),
        // for cover image we first need to create cover image file on our file system
        // then get the name from that and then save that into movie object
            // now we back and doing that above
        coverImageName: fileName,
        description: req.body.description
        // entire movie object created, now saving it:
    })
    try{
        const newMovie = await movie.save()
        // res.redirect(`movies/${newMovie.id}`)
        res.redirect(`movies`)
    }catch{
        if(movie.coverImageName != null){
        removeBookCover(movie.coverImageName)
    }
        // passing existing movie object
        // hasError = true
        renderNewPage(res, movie, true)
    }
})

function removeBookCover(fileName){
    // remove the file we don't want on our server
    // gets rid of any file that has the file name inside of movieCovers folder
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if(err) console.error(err)
    })
}

async function renderNewPage(res, movie, hasError = false){
    try{
        const directors = await Director.find({})
        // to dynamically create error message
        const params = {
            directors: directors,
            movie: movie
        }
        if(hasError) params.errorMessage = 'Error Creating Movie'
        res.render('movies/new', params)
    }catch{
        res.redirect('/movies')
    }
}
   
// exporting router
module.exports = router