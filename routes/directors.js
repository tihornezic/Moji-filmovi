const express = require('express')
const router = express.Router()

// all directors route
router.get('/', (req, res) => {
    // render and specify the name of the file that you want to render
    res.render('directors/index')
})

// new director route
router.get('/new', (req, res)=>{
    res.render('directors/new')
})

// create director route
router.post('/', (req, res)=>{
    res.send('Create')
})

// exporting router
module.exports = router