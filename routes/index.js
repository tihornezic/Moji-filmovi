const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')

router.get('/', async (req, res) => {
    // render and specify the name of the file that you want to render (index.ejs)
    // 
    let movies
    let searchOptions = {}
    if (req.query.title != null && req.query.title != '') {
        searchOptions.title = new RegExp(req.query.title, 'i')
    }
    try {
        // we want to sort movies by createdAt
        // descending order - newest ones first
        // only top 10 newest movies
        // in order to execute this code, exec()
        movies = await Movie.find(searchOptions).sort({createdAt: 'desc'}).limit(30).exec()
        res.render('index', {
            movies: movies,
            searchOptions: req.query
        })
    } catch {
        // if we get an array, initialize movies to an empty array
        movies = []
    }
    // we need to pass the movies here first

})

// exporting router
module.exports = router