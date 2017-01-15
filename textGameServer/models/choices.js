var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var choicesSchema = new Schema({
    title: String,
    description: String,
    success: {
        type: Schema.ObjectId,
        ref: 'events',
        required: true
    },
    failure: {
        type: Schema.ObjectId,
        ref: 'events',
        required: false
    },
    isHidden: Array,
    isLocked: Array,
    skill_check: {
        qualities: {},
        difficulty: Number,        
        required: false
    }
});

mongoose.model('choices', choicesSchema);