const express = require('express')
const router = express.Router()
const Director = require('../models/director')


// all directors route
router.get('/', (req, res) => {
    // render and specify the name of the file that you want to render
    res.render('directors/index')
})

// new director route
router.get('/new', (req, res)=>{
    res.render('directors/new', {director: new Director()})
})

// create director route
router.post('/', async (req, res)=>{
    const director = new Director({
        name: req.body.name
    })
    try{
        const newDirector = await director.save()
        // res.redirect(`directors/${newDirector.id}`)
        res.redirect(`directors`)
    }catch{
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