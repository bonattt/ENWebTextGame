const DEBUG = true;
const DEFAULT_WAIT_TIME = 1000;

const USERS_ID = 0;
const EVENTS_ID = 100;
const CHOICES_ID = 200;
const DECISIONS_ID = 300;
const PLAYERS_ID = 400;


var wait_time = DEFAULT_WAIT_TIME;

app = require('express');
mongoose = require('mongoose');
var fs = require('fs');
var ObjectID = mongoose.Schema.ObjectId;

var isComplete = {length: 0}


function usersId(item_id) {return new ObjectID(USERS_ID + item_id);}
function eventsId(item_id) {return new ObjectID(EVENTS_ID + item_id);}
function choicesId(item_id) {return new ObjectID(choices_ID + item_id);}
function decisionsId(item_id) {return new ObjectID(decisions_ID + item_id);}
function playersId(item_id) {return new ObjectID(players_ID + item_id);}


function run() {
    setWaitTime(process.argv);    
    setup('textGame');
    var models = ['users', 'events', 'choices', 'decisions', 'players']
    clearAll(models);
    
    if (process.argv.includes("-c") || process.argv.includes('-clear')) {
        disconnect();
        return;
    }
    // node executes as callbacks in reverse order these are called, I think.
    // it's not actually reverse order, but the first call is consistently executed last.
    models.forEach(function(model) {
        console.log(model);
        isComplete[model] = false;
    });
    initUsers(waitToDisconnect);
    initEvents();
    initChoices();
    initDecisions();
    initPlayers();
}

function setWaitTime(argv) {
    if (argv.includes('-nw') || argv.includes('-nowait')) {
        wait_time = 0;
    } else if (argv.includes('-w')) {
        var i = argv.indexOf('-w');
        // global var wait_time... sorry
        wait_time = parseInt(argv[i+1], 10)
        if (typeof(wait_time) != 'number') {
            console.log('WARNING!! bad wait time input');
            wait_time = DEFAULT_WAIT_TIME
        }
    }
}

function connect(database) {
    mongoose.connect('mongodb://127.0.0.1/' + database);
    console.log("connected to DB '" + database + "'");
}

function getInsertResultHandler(next, col_name) {
    return function (err, output) {
        // console.log('**** 1 ' + col_name + ' ****');
        if (!output) {
            console.log("failed to insert into " + col_name);
        } else {
            var num = output.result.n //output.ops.length;
            console.log(col_name + ' collection reinitialized with ' + num + ' entrie(s).');
        }
        isComplete[col_name] = true;
        // console.log('**** 2 ' + col_name + ' ****');
        if (next) {
            next();
        }
        // console.log('**** 3 ' + col_name + ' ****');
    };
}

function waitToDisconnect() {
    if (isComplete.length = 0) {
        setTimeout(waitToDisconnect, 1000);
    } else {
        for (col_name in isComplete) {
            if (col_name == 'length') {continue;}
            console.log(col_name + ": " + isComplete[col_name]);
            if (!isComplete[col_name]) {
                setTimeout(waitToDisconnect, 1000);
                return;
            }
        }
        disconnect();
    }
}

function disconnect() {
    console.log("\ndisconnecting....");
    mongoose.connection.close();
    console.log("successfully disconnected.");
    setTimeout(function() {}, wait_time); // wait_time is global
}

function setup(database) {
    fs.readdirSync(__dirname + '/models').forEach(function(filename) {
        if (~filename.indexOf('.js')) {
            require(__dirname + '/models/' + filename);
        }
    });
    connect(database);
}

function clearAll(models) {
    console.log("removing all data...");
    models.forEach(function (modelName) {
        mongoose.model(modelName).remove({}, function(){});
        console.log("successfully removed data from collection '" + modelName + "'");
    });
}

function initUsers(next) {
    if (DEBUG) {
        console.log("no current tasks in 'initUsers'");
    }
    var col_name = 'users';
    mongoose.model(col_name).collection.insert([
            {_id: usersId(1), username: "hello world", hash: -1},
            {_id: usersId(2), username: "goodbye world", hash: -1},
            {_id: usersId(3), username: "spam!", hash: -1},
            {_id: usersId(4), username: "name", hash: -1},
        ], getInsertResultHandler(next, col_name)
    );
//        ], function(err, output) {
//        var num = output.result.n //output.ops.length;
//        console.log("users collection reinitialized with " + num + " entry(s)!");
//    });
    // console.log("users collection reinitialized!");
}

function initEvents(next) {
    if (DEBUG) {
        console.log("TODO (initEvents): " +
                "\n\tadd events!"
            );
    }
    var col_name = 'events';
    mongoose.model(col_name).collection.insert([
        {
            next:  eventsId(1),
            title: "To be: success", 
            effect: 'effect',
            args: []
        },
        {
            next:  eventsId(1),
            title: "To be: success", 
            effect: 'effect',
            args: []
        },
        {},
    ], getInsertResultHandler(next, col_name));
}

function initChoices(next) {
    if (DEBUG) {
        console.log("TODO (initChoices):" +
                "\n\t add event IDs"
            );
    }
    var col_name = 'choices';
    mongoose.model(col_name).collection.insert([
        {   
            _id: choicesId(1),
            title: "To be",
            description: "To be, or not to be?"
            success: eventsId(1),
            failure: eventsId(1),
            isHidden: [],
            isLocked: [],
            skill_check: {
                qualities: {"strength": 5, "dexterity": 1},
                difficulty: 20,
            }
        },
        {   
            _id: choicesId(2),
            title: "Not to be",
            description: "Really, Hamlet, you butt?"
            success: eventsId(-1),
            failure: eventsId(-1),
            isHidden: [],
            isLocked: [],
        },
        {   
            _id: choicesId(3),
            title: "North",
            description: "You go north."
            success: eventsId(-1),
            failure: eventsId(-1),
            isHidden: [],
            isLocked: [],
        },
        {   
            _id: choicesId(4),
            title: "South",
            description: "You go south."
            success: eventsId(-1),
            isHidden: [],
            isLocked: [],
        },
        {   
            _id: choicesId(5),
            title: "East",
            description: "You go east."
            success: eventsId(-1),
            isHidden: [],
            isLocked: [],
        },
        {   
            _id: choicesId(6),
            title: "West",
            description: "You go west."
            success: eventsId(-1),
            isHidden: [],
            isLocked: [],
        },
    ], getInsertResultHandler(next, col_name));
    /**     SCHEMA (choices)
     *  title: String,
     *  description: String,
     *  success: {
     *      type: Schema.ObjectId,
     *      ref: 'events',
     *     required: true
     *  },
     *  failure: {
     *      type: Schema.ObjectId,
     *      ref: 'events',
     *      required: false
     *  },
     *  isHidden: Array,
     *  isLocked: Array,
     *  skill_check: {
     *      qualities: {},
     *      difficulty: Number,        
     *      required: false
     *  }
     */
}

function initPlayers(next) {
    if (DEBUG) {
        console.log("TODO (initPlayers): "
                + "\n\t Store actual equipment and items"
            );
    }
    var player1 = {
        _id: playersId(1),
        user: usersId(1),
        qualities: {"name": "player1", "dick size": 10},
        equipment: {
            inventory: {
                items: ["item1", "item2"],
                weight: 1,
                size: 2
            },
            headgear: "headgear",
            bodyware: "bodyware",
            footgear: "footgear",
            gloves: "gloves",
            carried: "carried"
        }
    }
    var player2 = {
        _id: playersId(2),
        user: usersId(2),
        qualities: {"name": "player2", "shoe size": 5},
        equipment: {
            inventory: {
                items: [{name: "item3", weight: 10, size: 1}, "item4"],
                weight: 5,
                size: 10
            },
            headgear: "headgear",
            bodyware: "bodyware",
            footgear: "footgear",
            gloves: "gloves",
            carried: "carried"
        }
    }
    var col_name = 'players';
    mongoose.model(col_name).collection.insert(
            [player1, player2], 
            getInsertResultHandler(next, col_name)
        );
}

function initDecisions(next) {
    if (DEBUG) {
        console.log("TODO (initDecisions): "
                + "\n\t add choices as refs"
            );
    }
    var decision1 = {
        _id: decisionsId(1),
        choices: [
                eventsId(1),
                eventsId(2)
            ],
        title: "to be or not to be",
        description: "that is the question. Is it nobeler to face the slings "
            + "and arrows of outrageous fortune."
    };
    var decision2 = {
        _id: decisionsId(2),
        choices: [
                eventsId(3),
                eventsId(4),
                eventsId(5),
                eventsId(6)
            ],
        title: "Which way will you go?",
        description: "Never Eat Soggy Waffles. Period.;"
    };
    
    var col_name = 'decisions';
    mongoose.model(col_name).collection.insert(
            [decision1, decision2],
            getInsertResultHandler(next, col_name)
        );
    
    /**
     *  choices: [],
     *  title: String,
     *  description: String
     */
}


run();
