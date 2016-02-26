/**
 *  Game
 *
 *  Gameplay related tests
 */

var expect = require('chai').expect,
    utils  = require('../src/utils');

describe('Game', function() {
    var Game = require('../src/game'),
        Board = require('../src/board');

    describe('constructor', function() {

        it('should have a boards property', function() {
            var game = new Game;

            expect(game).to.have.property('boards');
        });

        it('should have a computer board', function() {
            var game = new Game;

            expect(game.boards, 'Should have a computer board').to.have.property('computer');
            expect(game.boards.computer, 'Should be of type Board').to.be.instanceOf(Board);
        });

        it('should have a player board', function() {
            var game = new Game;

            expect(game.boards, 'Should have a player board').to.have.property('player');
            expect(game.boards.player, 'Should be of type Board').to.be.instanceOf(Board);
        });

    });

});
