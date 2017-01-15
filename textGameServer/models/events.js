var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventsSchema = new Schema({
    next: {
        type: Schema.ObjectId,
        ref: 'crossroads'
    },
    title: String,
    effect: String,
    args: []
});

mongoose.model('events', eventsSchema);