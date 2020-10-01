const express = require('express')
const router = express.Router()
const Director = require('../models/director')


// all directors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    // req.query instead of req.body
    // because a get request sends information through the query string
    // and post request sends information throught the body
        // if we passed a name field in the search form
        // if it is an empty string, don't filter by it
    if(req.query.name !=null && req.query.name !== ''){
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
        name: req.body.name
    })
    try {
        const newDirector = await director.save()
        // res.redirect(`directors/${newDirector.id}`)
        res.redirect('directors')
    } catch {
        res.render('directors/new', {
            director: director,
            errorMessage: 'Error creating Director'
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

// exporting router
module.exports = router