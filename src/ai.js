/**
 *  AI
 */
var states = require('./states'),
    utils = require('./utils'),
    _ = require('lodash');


function AI(gridSize) {
    this.gridSize = gridSize || 10;

    this.history = [];

    this.touched = null;
}


/**
 *  Register Action
 */
AI.prototype.registerAction = function(command, state) {
    var coord = utils.sanitise_coordinates(command, this.gridSize);

    this.history.push(command.toLowerCase());

    if (state === states.SHIP_TOUCHED) {
        this.touched = coord;
    }

    if (state === states.SHIP_DESTROYED ||
        state === states.SHIP_ALL_DESTROYED) {
        this.touched = null;
    }
}


/**
 *  Generate Command
 */
AI.prototype.command = function() {
    var command;

    if (this.touched === null) {
        command = this.random();

        while(this.history.indexOf(command) > -1) {
            command = this.random();
        }

        return command;
    }

    var surroundings = this.getSurroundings(this.touched),
        square;

    while( surroundings.length ) {
        square = _.sample(surroundings);

        if (!this.inHistory(square)) {
            return this.coordToCommand(square.x, square.y);
        }

        surroundings.splice( utils.findObjectInArray(square, surroundings), 1 );
    }

    this.touched = null;

    return this.random();
}


/**
 *  Generate a Random Command
 */
AI.prototype.random = function() {
    var size = this.gridSize,
        maxRange = size - 1,
        x = _.random(maxRange),
        y = _.random(maxRange);

    return this.coordToCommand(x, y);
}


/**
 *  Generate a list of squares surrounding the specified coordinates.
 *
 *  @param  Int x
 *  @param  Int y
 *  @return Array
 */
AI.prototype.getSurroundings = function(coord) {
    var xRange = this.getRange(coord.x),
        yRange = this.getRange(coord.y),
        surroundings = [];

    yRange.forEach((y) => {

        if (y === coord.y) {
            xRange.forEach((x) => {
                surroundings.push({ x: x, y: y });
            });
        } else {
            surroundings.push({ x: coord.x, y: y });
        }

    });

    return surroundings;
}


/**
 *  Generate Range for Surroundinds generation
 *
 *  @param  Int Index
 *  @return Array
 */
AI.prototype.getRange = function( index ) {
    var range = [];

    if (index - 1 >= 0) {
        range.push((index - 1));
    }

    range.push(index);

    if (index + 1 < this.gridSize) {
        range.push(index + 1);
    }

    return range;
}


/**
 *  Convert Object to Command string
 *
 *  @param  Int x
 *  @param  Int y
 *  @return String
 */
AI.prototype.coordToCommand = function(x, y) {
    var letter = String.fromCharCode( "a".charCodeAt() + x );
    return letter + y;
}


/**
 *  Check if coordinates have already been played
 *
 *  @param  ( x: Int, y: Int )  object
 *  @return Bool
 */
AI.prototype.inHistory = function( coord ) {
    var command = this.coordToCommand(coord.x, coord.y).toLowerCase();
    return this.history.indexOf(command) > -1;
}


module.exports = AI;
