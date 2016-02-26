/**
 *  Ship
 */

var expect = require('chai').expect;

describe('Ship', function() {
    var Ship = require('../src/ship');

    describe('generate()', function() {

        it('should generate a number of parts equal to the size of the ship', function() {
            var size4Ship = new Ship(4),
                size5Ship = new Ship(5);

            size4Ship.generate({x: 0, y: 0}, 'x');
            size5Ship.generate({x: 0, y: 0}, 'x');

            expect(size4Ship.parts, 'Should have 4 parts').to.have.lengthOf(4);
            expect(size5Ship.parts, 'Should have 5 parts').to.have.lengthOf(5);
        });

        it('should generate the part on the axis specified', function() {
            var xAxisShip = new Ship(4),
                yAxisShip = new Ship(4),
                lastPartX, lastPartY;

            xAxisShip.generate({ x:0, y:0 }, 'x');
            yAxisShip.generate({ x:0, y:0 }, 'y');

            lastPartX = xAxisShip.parts[3];
            lastPartY = yAxisShip.parts[3];

            expect(lastPartX, 'Last part position should be 3 on X-axis').to.have.property('x', 3);
            expect(lastPartX, 'Last part position should be 0 on Y-Axis').to.have.property('y', 0);

            expect(lastPartY, 'Last part position should be 0 on X-Axis').to.have.property('x', 0);
            expect(lastPartY, 'Last part position should be 3 on Y-Axis').to.have.property('y', 3);
        });

    });

    describe('isDestroyed()', function() {

        it('should be considered destroyed when all parts are hit', function() {
            var ship = new Ship(4);

            ship.parts.map(function( part ){
                part.hit = true;
            });

            expect(ship.isDestroyed()).to.be.true;
        });

    });


    describe('isHit()', function(){

        it('should return true if we hit the ship', function() {
            var ship = new Ship(4);
            ship.generate({ x: 0, y: 0 }, 'x');

            expect(ship.isHit({ x: 1, y: 0 })).to.be.true;
        });

        it('should return false if we miss the ship', function() {
            var ship = new Ship(4);
            ship.generate({ x: 0, y: 0 }, 'x');

            expect(ship.isHit({ x: 2, y: 2 })).to.be.false;
        });

    });

});
