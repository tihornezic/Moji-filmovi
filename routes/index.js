const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    // render and specify the name of the file that you want to render
    res.render('index')
})

// exporting router
module.exports = router