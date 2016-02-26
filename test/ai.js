/**
 *  AI
 */

var expect = require('chai').expect,
    AI = require('../src/ai'),
    states = require('../src/states');

describe('AI', function() {

    describe('constructor', function() {
        var gridSize = 10,
            computer = new AI(gridSize);

        it('should initiate an empty array for history', function() {
            expect(computer.history).to.be.instanceOf(Array);
        });


        it('should have a gridSize property', function() {
            expect(computer.gridSize).to.equal(gridSize);
        });


        it('should have a touched property', function() {
            expect(computer).to.have.property('touched');
        });
    });


    describe('registerAction()', function() {

        it('should add specified command to the history property', function() {
            var computer = new AI(10);

            computer.registerAction('A5', states.MISSED_HIT);

            expect(computer.history.indexOf('a5')).to.equal(0);
        });


        it('should add coordinates as the touched property when hitting a ship', function() {
            var computer = new AI(10),
                coord = { x: 5, y: 5 },
                command = computer.coordToCommand(coord.x, coord.y);

            computer.registerAction(command, states.SHIP_TOUCHED);

            expect(computer).to.have.deep.property('touched.x', coord.x);
            expect(computer).to.have.deep.property('touched.y', coord.y);
        });


        it('should clear touched property when SHIP is destroyed', function(){
            var computer = new AI(10);

            computer.registerAction('A5', states.SHIP_TOUCHED);
            computer.registerAction('A6', states.SHIP_DESTROYED);

            expect(computer).to.have.property('touched', null);
        });

    });

    describe('command()', function() {

        it('return a command formatted string ex: A5', function() {
            var computer = new AI(10);

            expect(computer.command()).to.match(/^[a-z]\d+/i);
        });

        it('should return a command for a square surrounding the previous hit', function() {
            var computer = new AI(10),
                command = computer.coordToCommand(5, 5);

            var possibleCommands = [
                { x: 4, y:4 }, { x:4, y: 5 }, { x: 4, y: 6 },
                { x: 5, y:4 }, { x:5, y: 5 }, { x: 5, y: 6 },
                { x: 6, y:4 }, { x:6, y: 5 }, { x: 6, y: 6 },
            ];

            possibleCommands = possibleCommands.map((coord) => {
                return computer.coordToCommand(coord.x, coord.y).toLowerCase();
            });

            computer.registerAction('C5', states.SHIP_TOUCHED);

            var newCommand = computer.command();

            expect(command).to.be.oneOf(possibleCommands);
        });

    });


    describe('random()', function() {

        it('should return the expected string format', function() {
            var computer = new AI(10);

            expect(computer.random()).to.match(/^[a-z]\d+/i);
        });

    });


    describe('getSurroundings()', function() {

        it('should return an array of coordinates of the squares surroundings the coordinate specified', function() {
            var computer = new AI(10),
                surroundings = computer.getSurroundings({ x: 5, y: 5 });

            var possibleCommands = [
                               { x:5, y: 4 },
                { x: 4, y:5 }, { x:5, y: 5 }, { x: 6, y: 5 },
                               { x:5, y: 6 }
            ];

            console.log(surroundings);

            expect(surroundings).to.eql(possibleCommands);
        });

    });


    describe('getRange()', function() {

        it('should return an array of 3 values when possible', function() {
            var computer = new AI(10);

            expect(computer.getRange(5)).to.eql([4, 5, 6]);
        });

        it('should omit out of range values within the array', function() {
            var computer = new AI(10);

            // Should exclude -1
            expect(computer.getRange(0)).to.eql([0, 1]);

            // should exclude 10
            expect(computer.getRange(9)).to.eql([8, 9]);
        });

    });


    describe('coordToCommand()', function() {

        it('should return the proper command for coordinates', function() {
            var computer = new AI(10);

            expect(computer.coordToCommand(0, 5)).to.equal('a5');
        });

    });


    describe('inHistory()', function() {

        it('should return true when it finds the coord in history', function() {
            var computer = new AI(10);

            computer.registerAction('A5', states.MISSED_HIT);

            expect(computer.inHistory({ x: 0, y: 5 })).to.be.true;
        });

        it('should return false when it doesn\'t ind the coord in history', function() {
            var computer = new AI(10);

            expect(computer.inHistory({ x: 0, y: 5 })).to.be.false;
        });

    });

})
