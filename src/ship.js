/**
 *  Ship
 */

function Ship(size) {
    this.size = size || 4;
    this.parts = [];
}


/**
 *  Generate Ship's parts
 *
 *  @param  { x: Int, y: Int }  position
 *  @param  String  direction   either x or y
 */
Ship.prototype.generate = function( _position, direction ) {
    var position = Object.create(_position);

    for(var i = 0; i < this.size; i++) {
        if (i > 0) {
            position[ direction ]++;
        }

        this.parts.push({
            x: position.x,
            y: position.y,
            hit: false
        });
    }

};


/**
 *  Check if the ship is destroyed
 *
 *  @return Bool
 */
Ship.prototype.isDestroyed = function(){
    var notDestroyed = false;

    this.parts.forEach(function( part ){
        if (!part.hit) {
            notDestroyed = true;
            return false;
        }
    });

    return !notDestroyed;
};


/**
 *  Check if the coordinate specified hit this ship
 *
 *  @param  Object  coordinates,
 *  @return Bool
 */
Ship.prototype.isHit = function( coordinates ) {
    var isHit = false;

    this.parts.forEach(function(part) {
        if (part.x === coordinates.x && part.y === coordinates.y) {
            part.hit = true;
            isHit = true;
            return false;
        }
    });

    return isHit;
}

module.exports = Ship;
