const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')
const Director = require('../models/director')



// all movies route
router.get('/', async (req, res) => {
    res.send('All movies')
})

// new movie route
router.get('/new', async (req, res) => {
    try{
        const directors = await Director.find({})
        const movie = new Movie()
        res.render('movies/new', {
            directors: directors,
            movie: movie
        })
    }catch{
        res.redirect('/movies')
    }
})

// create movie route
router.post('/', async (req, res) => {
    res.send('Create movie')
})

// exporting router
module.exports = router