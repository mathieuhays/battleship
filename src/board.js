/**
 *  Board
 */
var Ship = require('./ship'),
    utils = require('./utils'),
    states = require('./states'),
    _ = require('lodash');


function Board(gridSize) {
    this.gridSize = gridSize || 10;

    this.ships = [
        // Add battleship
        new Ship(5),
        // Add destroyers
        new Ship(4),
        new Ship(4)
    ];

    // Historic of hits
    this.hits = [];

    // Used squares. Help avoid to have ships crossing each other
    this.occupiedSquares = [];

    // Randomly place the generated ships on the grid
    this.ships.forEach((ship) => {
        this.placeShip(ship);
    });
}


/**
 *  Place ships within the grid
 *
 *  A random direction is being choosen (vertical or horizontal)
 *  as well as a random position.
 *
 *  @param  Ship  ship
 */
Board.prototype.placeShip = function( ship ) {
    var direction = _.sample(['x', 'y']),
        position = this.generatePosition( ship.size );

    while( this.willCrossAnotherShip(position, direction, ship.size) ) {
        position = this.generatePosition( ship.size );
    }

    ship.generate(position, direction);
    this.occupiedSquares = this.occupiedSquares.concat(ship.parts);
};


/**
 *  Detect if it won't cross existing ships
 *
 *  @param  { x: Int, y: Int }  position
 *  @param  String  direction   either x or y
 *  @param  Int shipSize
 *  @return Bool
 */
Board.prototype.willCrossAnotherShip = function( position, direction, shipSize ) {
    var temp_ship = new Ship(shipSize),
        isCrossing = false;

    temp_ship.generate(position, direction);

    temp_ship.parts.forEach(( part ) => {
        if (utils.findObjectInArray(part, this.occupiedSquares) >= 0) {
            isCrossing = true;
            return false;
        }
    });

    return isCrossing;
}


/**
 *  Generate random position for ship
 *  An offset corresponding to the ship size can be specified to ensure the
 *  ship remains within the grid
 *
 *  @param  Int  offset  optional
 *  @return { x: Int, y: Int }
 */
Board.prototype.generatePosition = function( _offset ) {
    var offset = _offset || 0,
        maxRange = this.gridSize - 1 - offset,
        x = _.random(maxRange),
        y = _.random(maxRange);

    return {
        x: x,
        y: y
    };
};


/**
 *  Hit the designated square
 *
 *  @param  String
 *  @return String | False
 */
Board.prototype.hit = function( _hit ) {
    var hit = _hit.toLowerCase(),
        coord = utils.sanitise_coordinates( hit, this.gridSize ),
        state = states.MISSED_HIT;

    if (coord === false) {
        return false;
    }

    if (this.hits.indexOf( hit ) >= 0) {
        return states.ALREADY_PLAYED;
    }

    this.hits.push( hit );

    this.ships.forEach((ship) => {

        if (ship.isHit( coord )) {

            if (ship.isDestroyed()) {

                if (this.allShipsDestroyed()) {
                    state = states.SHIP_ALL_DESTROYED;
                } else {
                    state = states.SHIP_DESTROYED;
                }

            } else {
                state = states.SHIP_TOUCHED;
            }

            return false;
        }
    });

    return state;
}


/**
 *  Get the number of ships yet to be destroyed
 *
 *  @return Int
 */
Board.prototype.remainingShips = function() {
    var shipsCount = 0;

    this.ships.forEach(function( ship ){
        if (!ship.isDestroyed()) {
            shipsCount++;
        }
    });

    return shipsCount;
}


/**
 *  Detect if all ships have been destroyed
 *
 *  @return Bool
 */
Board.prototype.allShipsDestroyed = function() {
    return this.remainingShips() === 0;
}


module.exports = Board;
