// mongoose to connect to mongoDB
const mongoose = require('mongoose')
// ./ means from our current directory
const Movie = require('./movie')

const directorSchema = new mongoose.Schema({
    // defining different columns of our schema
    // they are JSON objects
    name:{
        type: String,
        required: true
    }
})

// method for not allowing deleting director which is associated with particular movie
// mongoose has ways for us to run certain code before, after or
// during certain actions
// pre is method for before certain action occurs 
// runs before we actually remove the director
directorSchema.pre('remove', function(next){
    Movie.find({director: this.id}, (err, movies) => {
        // if mongoose can't connect to the db
        if(err){
            next(err)
        // if a particular director has movies in db
        // we do not want to delete that director
        }else if(movies.length > 0){
            next(new Error('Ovaj redatelj ima film!'))
        }else{
            // it is okay to remove director
            next()
        }
    })
})

// name of the table (schema)
module.exports = mongoose.model('Director', directorSchema)