var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playersSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'users',
        required: true
    }, // */
    qualities: {},      // Schema.Types.Mixed
    equipment: {
        inventory: {
            items: Array,
            weight: Number,
            size: Number
        },
        headgear: String,   // TODO
        bodyware: String,   // TODO
        footgear: String,   // TODO
        gloves: String,     // TODO
        carried: String     // TODO
    }
});

mongoose.model('players', playersSchema);