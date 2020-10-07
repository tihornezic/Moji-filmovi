const express = require('express')
const router = express.Router()

// for multer - commented out since started using filepond
/* const multer = require('multer') */
// node.js built in path
/* const path = require('path')
 */
// built in node library
// file system library
// used for not allowing saving cover image if the error occured
// delete cover images we don't need anymore
/* const fs = require('fs') */

const Movie = require('../models/movie')
const Director = require('../models/director')

// uploadPath is going to go from public folder into coverImageBasePath
/* const uploadPath = path.join('public', Movie.coverImageBasePath) */
// array of all different image types that we accept
// always default, always same for server: 
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
// 

/* const upload = multer({
    // where the upload is going to be
    // we don't want to hardcode it, but to come from movie model
    dest: uploadPath, // is basically 'public/uploads/movieCovers'
    // to filter which files server accepts
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
}) */


// all movies route
router.get('/', async (req, res) => {
    // if we pass Movie.find() with no parameters, this returns to us a query object
    // which we can then build a query from and then execute later
    // and we want to build this query from our request query parameters
    let query = Movie.find()
    // query of a title
    if (req.query.title != null && req.query.title != '') {
        // 'title' is db model parameter so esentially movie.title object of our db
        // regular expression contains title and ignors capital or loweracase
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    // filter for publishedBefore
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        // .lte - less than or equal to
        // if the releaseYear <= publishedBefore
        // then we want to return that object
        query = query.lte('releaseYear', req.query.publishedBefore)
    }
    // filter for publishedAfter
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
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
// deleted since using filepond , upload.single('cover')
// and uninstalling multer
router.post('/', async (req, res) => {
    // this library is also going to add a variable to our request which is file
    // we're getting file name from the file if it exists and give it that name
    /* const fileName = req.file != null ? req.file.filename : null */
    // new movie object
    const movie = new Movie({
        // setting default values ?OR? creating new movie object ??? 
        title: req.body.title,
        director: req.body.director,
        // converting string date into actual date using new Date
        releaseYear: new Date(req.body.releaseYear),
        genre: req.body.genre,
        duration: parseInt(req.body.duration),
        // for cover image we first need to create cover image file on our file system
        // then get the name from that and then save that into movie object
        // for that we're gonna use library multer (multi part forms)
        // if we uploaded a file fileName is going to be equal to the name of that file
        // but if not, it will be null, so we can send error msg
        /* coverImageName: fileName, */
        description: req.body.description
        // entire movie object created, now saving it:
    })
    // uploading a movie file into our actual movie model
    // saving cover image
    saveCover(movie, req.body.cover)

    // saving a movie
    try {
        const newMovie = await movie.save()
        res.redirect(`movies/${newMovie.id}`)
        // res.redirect(`movies`)
    } catch {
        // passing existing movie object
        // hasError = true because we are in catch section which is for handling errors
        renderNewPage(res, movie, true)
    }
})

// since we're no longer storing our images on the server, we no longer need to worry about
// removing book covers
// function for removing cover image files which we don't want on our server
/* function removeBookCover(fileName) {
    // remove the file we don't want on our server
    // gets rid of any file that has the file name inside of movieCovers folder
    // we wanna pass it the path where this file is at
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
} */

// show movie route
router.get('/:id', async (req, res) => {
    try {
        // using .populate so director does not display as id but his actual name
        // so it will populate the movie variable inside movie object
        // with all of the director information (in this case name)
        // populate preloads all the director information before it actually returns the movie
        const movie = await Movie.findById(req.params.id).populate('director').exec()
        res.render('movies/show', {
            movie: movie
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// edit movie route
router.get('/:id/edit', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        renderEditPage(res, movie)
    }catch{
        res.redirect('/')
    }
    
})

// update movie route
router.put('/:id', async (req, res) => {
    let movie
    try {
        movie = await Movie.findById(req.params.id) 
        movie.title = req.body.title
        // req.body.director because we set the <select name = "director"> in _form_fiuels.ejs
        movie.director = req.body.director
        movie.releaseYear = new Date(req.body.releaseYear)
        movie.genre = req.body.genre
        movie.duration = parseInt(req.body.duration)
        movie.description = req.body.description
        // if cover exists
        // we don't want to delete the cover that user already uploaded
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(movie, req.body.cover)
        }
        await movie.save()
        res.redirect(`/movies/${movie.id}`)
    } catch {
        
        // if we successfully got the movie but had problem saving the movie
        if(movie != null){
            renderEditPage(res, movie, true)
        // if we couldn't get the movie
        }else{
            res.redirect('/')
        }
    }
})

// delete movie page
router.delete('/:id', async (req, res) => {
    let movie
    try{
        movie = await Movie.findById(req.params.id)
        await movie.remove()
        res.redirect('/movies')
    }catch{
        // if we have a movie
        if(movie != null){
            res.render('movies/show', {
                movie: movie,
                errorMessage: 'Neuspješno uklanjanje filma!'
            })
        }else{
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, movie, hasError = false) {
    renderFormPage(res, movie, 'new', hasError)
}

async function renderEditPage(res, movie, hasError = false) {
    renderFormPage(res, movie, 'edit', hasError)
}

// shared function for the 2 above so we don't have to duplicate this code
async function renderFormPage(res, movie, form, hasError = false) {
    try {
        let movieGenres =
            ["Akcijski", "Avanturistički", "Komedija",
                "Kriminalistički", "SF", "Drama", "Horor",
                "Triler", "Animirani", "Dokumentarni", "Ratni",
                "Ostalo"
            ]
        const directors = await Director.find({})
        // to dynamically create error message
        // parameters we're sending to the server
        const params = {
            directors: directors,
            movieGenres,
            movie: movie
        }
        if(hasError){
            // if we are on the edit form
            if(form == 'edit'){
                params.errorMessage = 'Error Updating Movie'
            }else{
                params.errorMessage = 'Error Creating Movie'
            }
        }
        // to dynamically render form
        res.render(`movies/${form}`, params)
    } catch {
        res.redirect('/movies')
    }
}

// stores files inside our db so we can use it inside heroku
function saveCover(movie, coverEncoded) {
    // if coverEncoded is a valid variable, save it to movie.cover
    // if it is null we want to return from this function and actually don't do anything
    if (coverEncoded == null) return
    // parsing coverEncoded into a JSON
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        // converting cover.data to a buffer
        // first parameter is our data and second is how we want to convert it
        movie.coverImage = new Buffer.from(cover.data, 'base64')
        movie.coverImageType = cover.type
    }
}

// exporting router
module.exports = router