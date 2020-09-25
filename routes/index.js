const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')

router.get('/', async (req, res) => {
    // render and specify the name of the file that you want to render (index.ejs)
    // passing movies first
    // 
    let movies
    try{
        // we want to sort movies by createdAt
        // descending order - newest ones first
        // only top 10 newest movies
        // in order to execute this code, exec()
        movies = await Movie.find().sort({createdAt: 'desc'}).limit(10).exec()
    }catch{
        movies = []
    }
    res.render('index', {movies: movies})
})

// exporting router
module.exports = router