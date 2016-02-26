/**
 *  Utils
 */
var _ = require('lodash');

/**
 *  Get Index number from Letter
 *
 *  @param  String  letter
 *  @return Int
 */
function getIndexFromLetter(letter) {
    var letterCode = letter.toLowerCase().charCodeAt(),
        refCode = "a".charCodeAt();

    return letterCode - refCode;
}


/**
 *  indexOf equivalent for testing if Object is in array
 *
 *  @param  Object      object
 *  @param  [ Object ]  array
 *  @return Int
 */
function findObjectInArray(object, array) {
    var index = -1,
        keys = Object.keys(object);

    if (!Array.isArray(array) || !array.length) return index;

    array.forEach(function( obj, i ){
        if (_.isEqual(object, obj)) {
            index = i;
            return false;
        }
    });

    return index;
}


/**
 *  Sanitise and convert coordinates from a command string. (ex: A5)
 *
 *  @param  String  command
 *  @param  Int     gridSize
 *  @return { x: Int, y: Int }
 */
function sanitise_coordinates( command, gridSize ) {
    var maxRange = gridSize - 1,
        minRange = 0,
        letter = command.substr(0, 1),
        number = parseInt( command.substr(1) ),
        x, y, xInRange, yInRange;

    if (isNaN( number ) || letter.match(/[a-z]/i) === null) {
        return false;
    }

    x = getIndexFromLetter(letter);
    y = number;

    xInRange = x >= minRange && x <= maxRange;
    yInRange = y >= minRange && y <= maxRange;

    if ( !xInRange || !yInRange ) {
        return false;
    }

    return {
        x: x,
        y: y
    }
}


module.exports = {
    getIndexFromLetter: getIndexFromLetter,
    findObjectInArray: findObjectInArray,
    sanitise_coordinates: sanitise_coordinates
}
