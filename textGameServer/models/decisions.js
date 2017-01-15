var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var decisionsSchema = new Schema({
    choices: [],
    title: String,
    description: String
});

mongoose.model('decisions', decisionsSchema);