const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')

router.get('/', async (req, res) => {
    // render and specify the name of the file that you want to render (index.ejs)
    // 
    let movies
    try{
        // we want to sort movies by createdAt
        // descending order - newest ones first
        // only top 10 newest movies
        // in order to execute this code, exec()
        movies = await Movie.find().sort({createdAt: 'desc'}).limit(10).exec()
    }catch{
        // if we get an array, initialize movies to an empty array
        movies = []
    }
    // we need to pass the movies here first
    res.render('index', {movies: movies})
})

// exporting router
module.exports = router