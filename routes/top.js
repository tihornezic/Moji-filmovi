const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')

router.get('/', async (req, res) => {
    let moviesByRating
    try{
        moviesByRating = await Movie.find().sort({rating: 'desc'}).limit(100).exec()
        res.render('top', {
            moviesByRating: moviesByRating
        })
    }catch{
        moviesByRating = []
    }
})

module.exports = router
