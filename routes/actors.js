const express = require('express')
const router = express.Router()
const Actor = require('../models/actor')
const director = require('../models/director')
const Movie = require('../models/movie')

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// all actors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const actors = await Actor.find(searchOptions)
        res.render('actors/index', {
            actors: actors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new actor route
router.get('/new', async (req, res) => {
    try {
        const movies = await Movie.find()
        const params = {
            actor: new Actor(),
            // movies: movies
        }
        res.render('actors/new', params)
    } catch {
        res.redirect('/')
    }

})

// post actor route
router.post('/', async (req, res) => {
    const actor = new Actor({
        name: req.body.name,
        description: req.body.description,
        // movie: req.body.movie
    })

    try {
        saveCover(actor, req.body.cover)
        const newActor = await actor.save()
        res.redirect('actors')
        // res.redirect(`actors/${newActor.id}`)
    } catch {
        res.render('actors/new', {
            actor: actor,
            errorMessage: 'Pogreška pri kreiranju glumca'
        })
    }
})

// show actor route
router.get('/:id', async (req, res) => {
    try{
        const actor = await Actor.findById(req.params.id)
        const movie = await Movie.find({actor: req.params.id})
        res.render('actors/show', {
            actor: actor,
            movie: movie
        })
    }catch{
        res.redirect('/')
    }
})

// edit movie route
router.get('/:id/edit', async (req, res) => {
    try{
        const actor = await Actor.findById(req.params.id)
        res.render('actors/edit', {
            actor: actor
        })
    }catch{
        res.redirect('/actors')
    }
})

// update actor route
router.put('/:id', async (req, res) => {
    let actor
    try{
        actor = await Actor.findById(req.params.id)
        actor.name = req.body.name,
        actor.description = req.body.description
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(actor, req.body.cover)
        }
        await actor.save()
        res.redirect(`/actors/${actor.id}`)
    }catch{
        res.render('actors/edit', {
            actor: actor,
            errorMessage: 'Error updating Actor'
        })
    }
})

// delete actor route
router.delete('/:id', async (req, res) => {
    let actor
    try{
        actor = await Actor.findById(req.params.id)
        await actor.remove()
        res.redirect('/actors')
    }catch{
        res.redirect('/')
    }
})

function saveCover(actor, coverEncoded) {
    // if coverEncoded is a valid variable, save it to movie.cover
    // if it is null we want to return from this function and actually don't do anything
    if (coverEncoded == null) return
    // parsing coverEncoded into a JSON
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        // converting cover.data to a buffer
        // first parameter is our data and second is how we want to convert it
        actor.coverImage = new Buffer.from(cover.data, 'base64')
        actor.coverImageType = cover.type
    }
}

module.exports = router