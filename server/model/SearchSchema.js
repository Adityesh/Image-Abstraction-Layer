const mongoose = require('mongoose')

const SearchSchema = mongoose.Schema({
    query : {type : String},
    created : {type : Date},
    bumped : {type : Date}
}, {versionKey : false})


module.exports = mongoose.model('Search', SearchSchema)