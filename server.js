// 
// load .env
// check if we are running in the production environment
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

// including/fetching routes
// './' relative to where we are
const indexRouter = require('./routes/index')
const directorRouter = require('./routes/directors')

app.set('view engine', 'ejs')
// all of the different views of our files are gonna go for server
app.set('views', __dirname + '/views') 
// hooking up express layouts
// every single file is going to be put inside this layout file so we don't have to duplicate 
// all of the headers and footers of html
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

// mongodb setup
const mongoose = require('mongoose')
const { request } = require('express')
// connection to the DB
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
//

app.use('/', indexRouter)
// every route inside directorRouter will be prepended with /directors
app.use('/directors', directorRouter)

app.listen(process.env.PORT || 3000)
