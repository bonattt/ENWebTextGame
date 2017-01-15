var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    username: String,
    hash: Number
});

mongoose.model('users', usersSchema);