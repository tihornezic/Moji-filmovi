const express = require('express')
const router = express.Router()
const Director = require('../models/director')
const Movie = require('../models/movie')


// all directors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    // req.query instead of req.body
    // because a get request sends information through the query string
    // and post request sends information throught the body
    // if we passed a name field in the search form
    // if it is an empty string, don't filter by it
    if (req.query.name != null && req.query.name !== '') {
        // 'i' case insensitive
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    // getting all directors
    try {
        // empty find({}) means it has no conditions
        const directors = await Director.find(searchOptions)
        // render and specify the name of the file that you want to render
        // and passing object which has directors and searchOptions
        res.render('directors/index', {
            directors: directors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new director route
router.get('/new', (req, res) => {
    // variables to be sent to .ejs file
    // this actually doesn't save it to the DB,
    // but it does create new director that then we can save, update, delete in DB
    // also creates object that we can use in our .ejs file
    // ? { director: new Director() }
    res.render('directors/new', { director: new Director() })
})

// create director route
router.post('/', async (req, res) => {
    const director = new Director({
        name: req.body.name,
        description: req.body.description
    })
    try {
        const newDirector = await director.save()
        res.redirect(`directors/${newDirector.id}`)
    } catch {
        res.render('directors/new', {
            director: director,
            errorMessage: 'Pogreška pri kreiranju redatelja'
        })
    }

    // director.save((err, newDirector) =>{
    //     if(err){
    //         let locals = {errorMessage: `something went wrong`}
    //         res.render('directors', locals)
    //     }else{
    //         /* res.redirect(`directors/${newDirector.id}`) */
    //         res.redirect(`directors`)
    //     }
    // })
    /* res.send(req.body.name) */
})


// get for showing director
// /:id afther the : is going to be a variable called id that is going
// to be passed along with our request
router.get('/:id', async (req, res) => {
    // params is going to give us all the parameters that we defined
    // inside of our url pass
    /* res.send('Show Director ' + req.params.id) */
    try{
        const director = await Director.findById(req.params.id)
        const movies = await Movie.find({director: director.id}).limit(15).exec()
        res.render('directors/show', {
            director: director,
            moviesByDirector: movies
        })
    }catch{
        res.redirect('/')
    }
})

// edit route
router.get('/:id/edit', async (req, res) => {
    try {
        // findById is method built in mongoose library
        // finds director by id it it exists
        const director = await Director.findById(req.params.id)
        // instead of rendering new, getting director from the db
        res.render('directors/edit', { 
            director: director 
        })
    } catch {
        res.redirect('/directors')
    }

})

// from a browser, you can only make get and post requests
// to use put and delete, we need to install library method-override:
// npm i method-override
// what it does: allows us to take a post form, send it to our server
// with a special parameter that tells us if we're doing a put or delete request
// and then our server will be smart enough to call the correct router below
// based on that specific parameter

// update route
// using put for updating!
router.put('/:id', async (req, res) => {
    /* res.send('Update Director ' + req.params.id) */
    // why director is defined here instead of try block is because
    // director needs to be available inside catch block as well
    let director
    try {
        // uses mongoose db to get the director by id given in router.put
        director = await Director.findById(req.params.id) // passing id that we got from parameters
        // changed to new name before saving it
        director.name = req.body.name
        director.description = req.body.description
        // saving director
        await director.save()
        res.redirect(`/directors/${director.id}`)
    } catch {
        // if we never found the director
        // that way we don't redirect to a director that don't actually exists
        if (director == null) {
            res.redirect('/')
        // if the director does exist
        } else {
            res.render('directors/edit', {
                director: director,
                errorMessage: 'Error updating Director'
            })
        }
    }
})

// delete route
// never use get for deleting data, always use delete!
router.delete('/:id', async (req, res) => {
    /* res.send('Delete Director ' + req.params.id) */
    // we don't want allow deleting director which is associated with particular movie
    // because then we would have movie referencing director that does not exist!
    // setting constraints to prevent that from happening in director.js
    let director
    try {
        director = await Director.findById(req.params.id)
        // deletes the director from the db
        await director.remove()
        res.redirect('/directors')
    } catch {
        if (director == null) {
            res.redirect('/')
        } else {
            res.redirect(`/directors/${director.id}`)
        }
    }
})


// exporting router
module.exports = router