const mongoose = require('mongoose')

const actorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    coverImage: {
        type: Buffer,
        required: true
    },

    coverImageType: {
        type: String,
        required: true
    },

    description:{
        type: String
    }

})

actorSchema.virtual('coverImagePath').get(function () {
    if (this.coverImage != null && this.coverImageType != null) {
        // we want to return the source of our image object
        // returns proper string for our image source in order to display image from our buffer
        // data object is a source for images allows us to take Buffer data and use it as source for images 
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Actor', actorSchema)