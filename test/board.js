/**
 *  Board related tests
 */

var expect = require('chai').expect,
    utils  = require('../src/utils');

describe('Board', function() {
    var Board  = require('../src/board'),
        Ship   = require('../src/ship'),
        states = require('../src/states');


    describe('constructor', function() {

        it('should default to size 10 for the grid', function() {
            var board = new Board;

            expect( board.gridSize ).to.equal(10);
        });

        it('should contain 3 ships', function() {
            var board = new Board;

            expect(board.ships.length).to.equal(3);
        });

        it('should contain 1 ship of size 5', function() {
            var board = new Board,
                size5Count = 0;

            board.ships.forEach(function( ship ){
                if (ship.size === 5) {
                    size5Count++;
                }
            });

            expect(size5Count).to.equal(1);
        });

        it('should contain 2 ships of size 4', function() {
            var board = new Board,
                size4Count = 0;

            board.ships.forEach(function( ship ){
                if (ship.size === 4) {
                    size4Count++;
                }
            });

            expect(size4Count).to.equal(2);
        });

    });


    describe('generatePosition()', function() {

        it('should generate both x & y properties', function() {
            var board = new Board;

            expect(board.generatePosition()).to.have.all.keys(['x', 'y']);
        });

        it('should generate a number within the grid size', function() {
            var board = new Board,
                maxRange = board.gridSize - 1,
                position = board.generatePosition();

            expect(position.x, 'X should be within the range').to.be.within(0, maxRange);
            expect(position.y, 'Y should be within the range').to.be.within(0, maxRange);
        });

    });


    describe('placeShip()', function() {

        it('should position the ship within the grid', function() {
            var board = new Board,
                ship = new Ship(4),
                firstPart, lastPart;

            board.placeShip(ship);

            firstPart = ship.parts[0];
            lastPart = ship.parts[( ship.parts.length - 1 )];

            expect(firstPart.x, 'Ship should start within the grid (X)').to.be.at.least(0);
            expect(firstPart.y, 'Ship should start within the grid (Y)').to.be.at.least(0);

            expect(lastPart.x, 'Ship should end within the grid (X)').to.be.below(board.gridSize);
            expect(lastPart.y, 'Ship should end within the grid (Y)').to.be.below(board.gridSize);
        });

    });


    describe('willCrossAnotherShip()', function() {

        it('should detect when ships are crossing each other', function() {
            var board = new Board,
                ship = new Ship(4),
                shipPosition = {
                    x: 2,
                    y: 4
                },
                testPosition = {
                    x: 4,
                    y: 2
                },
                test;

            // Override for ease of test
            board.ships = [ ship ];
            board.occupiedSquares = board.ships[0].parts;

            ship.generate( shipPosition, 'x' )

            test = board.willCrossAnotherShip( testPosition, 'y', 4 );

            expect(test).to.be.true;
        });

    });


    describe('hit()', function() {

        it('should detect is the command is valid', function(){
            var board = new Board;

            expect( board.hit('non valid command') ).to.be.false;
        });

        it('should return ALREADY_PLAYED when coordinates are played multiple times', function() {
            var board = new Board,
                command = 'A5';

            board.hit(command);
            expect( board.hit(command) ).to.equal( states.ALREADY_PLAYED );
        });

        it('should add the hit to the hit historic', function() {
            var board = new Board,
                command = 'A5';

            board.hit(command);

            expect( board.hits[0] ).to.equal( command.toLowerCase() );
        });

        it('should return MISSED_HIT when missing to hit a ship', function() {
            var board = new Board,
                testPosition = { x: 0, y: 0 },
                letter, command;

            while( utils.findObjectInArray(testPosition, board.occupiedSquares) >= 0 ) {
                if (testPosition.x < (board.gridSize - 1)) {
                    testPosition.x++;
                } else {
                    testPosition.y++;
                }
            }

            letter = String.fromCharCode( "a".charCodeAt() + testPosition.x );
            command = letter + testPosition.y;

            expect( board.hit(command) ).to.equal( states.MISSED_HIT );
        });

        it('should return SHIP_TOUCHED when hitting a ship', function() {
            var board = new Board,
                part = board.ships[0].parts[0],
                letter = String.fromCharCode( "a".charCodeAt() + part.x ),
                command = letter + part.y;

            expect( board.hit(command) ).to.equal( states.SHIP_TOUCHED );
        });

        it('should return SHIP_DESTROYED when we did hit all the parts of the ship', function() {
            var board = new Board,
                parts = board.ships[0].parts,
                lastPartIndex = parts.length - 1,
                testCommand;

            parts.forEach(( part, index ) => {
                var letter = String.fromCharCode("a".charCodeAt() + part.x),
                    command = letter + part.y;

                if (lastPartIndex === index) {
                    testCommand = command;
                } else {
                    board.hit(command);
                }

            });

            expect( board.hit(testCommand) ).to.equal( states.SHIP_DESTROYED );
        });

    });


    describe('allShipsDestroyed()', function() {

        it('should return true if all ships are destroyed', function() {
            var board = new Board;

            board.ships.forEach(function(ship){
                ship.parts.forEach(function(part) {
                    part.hit = true;
                });
            });

            expect(board.allShipsDestroyed()).to.be.true;
        });

        it('should return false if not all ships are destroyed', function() {
            var board = new Board;

            // Destroy only one of the three ships
            board.ships[0].parts.forEach(function( part ) {
                part.hit = true;
            });

            expect(board.allShipsDestroyed()).to.be.false;
        });

    });

});
