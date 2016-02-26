/**
 *  AI
 */

var states = require('./states'),
    utils = require('./utils');


function AI(gridSize) {
    this.gridSize = gridSize || 10;
    this.history = [];

    this.initialTouched = null;
    this.lastTouched = null;
    this.positiveProgression = true;
}


/**
 *  Save action in history
 */
AI.prototype.registerAction = function(command, state) {
    this.history.push(command);

    var coord = utils.sanitise_coordinates(command);

    if (state === states.SHIP_TOUCHED) {
        if (this.initialTouched === null) {
            this.initialTouched = coord;
        }

        this.lastTouched = coord;
    }

    if (state === states.SHIP_DESTROYED || state === states.SHIP_ALL_DESTROYED) {
        this.initialTouched = null;
        this.lastTouched = null;
        this.positiveProgression = true;
    }

    // Revert progression direction when we are not hitting the ship anymore
    if (state === states.MISSED_HIT && this.initialTouched) {
        
    }
}


AI.prototype.command = function() {
    /**
     *  No initial touched detected
     */
    if (this.initialTouched === null) {
        return this.randomCommand();
    }

    /**
     *  Initial Touched, we try to hit one of the squares surrounding the hit.
     */
    if (_.isEqual(this.initialTouched, this.lastTouched)) {
        let surroundings = this.getSurroundings(thi.initialTouched);
        return this.coordToCommand( _.sample( surroundings ) );
    }

    /**
     *  Figure out the direction if possible
     */
    let direction;

    if (this.initialTouched.x === this.lastTouched.x) {
        direction = 'x';
    } else if (this.initialTouched.y === this.lastTouched.y) {
        direction = 'y';
    } else {
        return this.randomCommand();
    }

    /**
     *  progress along the defined axis.
     */
    if (this.positiveProgression) {
        return _.create(this.lastTouched)[direction]++;
    } else {
        return _.create(this.lastTouched)[direction]--;
    }
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
 *  Generate Random coordinates for command
 *
 *  @return String
 */
AI.prototype.randomCommand = function() {
    var currentPlayer = this.getCurrentPlayer(),
        size = this.gridSize,
        maxRange = size - 1,
        x = _.random(maxRange),
        y = _.random(maxRange);

    return this.coordToCommand(x, y);
}


AI.prototype.getSurroundings = function(x, y) {
    var xMin = x - 1,
        xMax = x + 1,
        yMin = y - 1,
        yMax = y + 1;

    var xRange = [(x - 1), x, (x + 1)],
        yRange = [(y - 1), y, (y + 1)];

    var surroundings = [];

    xRange.forEach(( coordX ) => {
        if (coordX < 0) return true;
        if (coordX >= this.gridSize) return true;

        yRange.forEach(( coordY ) => {
            if (coordY < 0) return true;
            if (coordY >= this.gridSize) return true;

            surroundings.push({
                x: coordX,
                y: coordY
            });
        });
    });

    return surroundings;
}
