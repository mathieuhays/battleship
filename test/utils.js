/**
 *  Utils tests
 */

var expect = require('chai').expect;

describe('Utils', function() {
    var utils = require('../src/utils');

    describe('getIndexFromLetter()', function() {
        var getIndexFromLetter = utils.getIndexFromLetter;

        it('should return 1 for letter b (lowercase)', function() {
            expect( getIndexFromLetter("b") ).to.equal(1);
        });

        it('should return 1 for letter B (uppercase)', function() {
            expect( getIndexFromLetter("B") ).to.equal(1);
        });
    });


    describe('findObjectInArray()', function() {

        it('should find return a positive integer when finding a matching object', function() {
            var array = [{x:0, y:0}, {x:3, h:false}, {x:4, y:7}];

            expect(utils.findObjectInArray({x:4, y:7}, array)).to.be.at.least(0);
        });

        it('should return -1 when the object is not found', function() {
            var array = [{x: 6}, {x: 8}, {y: 9}];

            expect(utils.findObjectInArray({z: 6}, array)).to.equal(-1);
        });

        it('should return -1 if the array is not valid or empty', function() {
            expect(utils.findObjectInArray({x: 7}, "invalid")).to.equal(-1);
        });

    });


    describe('sanitise_coordinates()', function() {
        var gridSize = 10;

        it('should return expected output with valid arguments', function() {
            var coord = utils.sanitise_coordinates('B5', gridSize);

            expect( coord ).to.have.property('x', 1);
            expect( coord ).to.have.property('y', 5);
        });

        it('should fail when the letter coord is out of range', function() {
            expect( utils.sanitise_coordinates('Z4', gridSize) ).to.be.false;
        });

        it('should fail when the number is out of range', function() {
            expect( utils.sanitise_coordinates('C15', gridSize) ).to.be.false;
        });

        it('should fail if the argument is not a coordinate', function() {
            expect( utils.sanitise_coordinates('test', gridSize) ).to.be.false;
        });

    });


    describe('objectAreSimilar()', function() {

        it('should return true when testing two matching objects', function() {

        });

        it('should return false when testing two objects with different values', function() {

        });

    });

});
