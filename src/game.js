/**
 *  Game
 */
var Board = require('./board'),
    states = require('./states'),
    utils = require('./utils'),
    AI = require('./ai'),
    prompt = require('prompt'),
    fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    _ = require('lodash');


function Game() {
    this.name = 'Battleship';
    this.gridSize = 10;

    this.boards = {
        computer: new Board(this.gridSize),
        player: new Board(this.gridSize)
    };

    this.players = ['player', 'computer'];

    // used to loop through the players
    this.currentTurn = -1;

    this.computer = new AI(this.gridSize);

    // Init the prompt util
    prompt.start();
    prompt.message = '';

    // Configure the input we expect
    this.promptConfig = [
        {
            name: 'Action',
            validator: /^(([a-z])(\d)+|quit)$/i,
            warning: 'Expect a letter and number. No space. Ex: A5',
            required: true
        }
    ];
}


/**
 *  Initiate the game.
 */
Game.prototype.start = function() {
    var banner = fs.readFileSync( path.join(__dirname, '/battleship.ascii') );
    process.stdout.write( chalk.green( banner ) );

    console.log([
        "Welcome to the battleship game.",
        "You are playing against the computer.",
        "You both have 1 battleship (5 squares) & 2 destroyers (4 squares) placed randomly on the map.",
        "Example of Command: A5",
        "",
        "Note: type 'quit' to exit the game.",
        ""
    ].join('\n'));

    this.nextTurn();
}


/**
 *  Ask User for input
 */
Game.prototype.prompt = function() {
    prompt.get(this.promptConfig, (err, result) => {
        if (err) {
            return console.log(chalk.red( err ));
        }

        if (result.Action == 'quit') {
            console.log('\nExit Battleship...');
            return;
        }

        this.play(result.Action);
    });
}


/**
 *  Get current player
 *
 *  @return String
 */
Game.prototype.getCurrentPlayer = function() {
    return this.players[ this.currentTurn ];
}


/**
 *  Play
 *
 *  Most of the "scenario" handling happens here
 *
 *  @param  String  command
 */
Game.prototype.play = function( command, callback ) {
    var currentPlayer = this.getCurrentPlayer(),
        state = this.boards[ currentPlayer ].hit( command ),
        message;

    if (_.isFunction(callback)) {
        callback(command, state);
    }

    if ( state === states.MISSED_HIT ) {
        displayResult("The "+ currentPlayer +" hasn't hit any ship.");
        this.nextTurn();
        return;
    }

    if ( state === states.SHIP_ALL_DESTROYED ) {
        displayResult("The "+ currentPlayer +" shot all ships !!");

        if (currentPlayer === 'player') {
            win();
        } else {
            gameOver();
        }

        return;
    }

    switch( state ) {

        case states.ALREADY_PLAYED:
            message = "Already Played, try again...";
        break;

        case states.SHIP_TOUCHED:
            message = [
                "The "+ currentPlayer +" touched a ship !!",
                currentPlayer === 'player' ? "Shoot again!" : ''
            ].join(' ');
        break;

        case states.SHIP_DESTROYED:
            message = [
                "The "+ currentPlayer +" destroyed a ship. Shoot again!",
                "Remaining ships to destroy: " + chalk.italic( this.boards[ currentPlayer ].remainingShips() )
            ].join(' - ');

        break;

        default:
            message = "This coordinate is too far, try again...";

    }

    displayResult(message);

    this.action();
}


/**
 *  Next Turn
 *
 *  Switch players
 */
Game.prototype.nextTurn = function() {
    var currentPlayer;

    // Grab next player in the list
    if (this.currentTurn < (this.players.length - 1)) {
        this.currentTurn++;
    } else {
        this.currentTurn = 0;
    }

    currentPlayer = this.getCurrentPlayer();

    displayPlayerHeader(currentPlayer);

    this.action();
}


/**
 *  Action
 */
Game.prototype.action = function() {
    var command;

    if (this.getCurrentPlayer() === 'computer') {
        command = this.computer.command();
        displayAction(command);
        this.play( command, (command, state) => {
            this.computer.registerAction(command, state);
        });
        return;
    }

    this.prompt();
}


/**
 *  Display action
 *
 *  @param  String  action
 */
function displayAction(action) {
    console.log( chalk.gray('Action:  ') + action.toUpperCase() );
}


/**
 *  Display Result
 *
 *  @param  String  result
 */
function displayResult(result) {
    console.log( chalk.gray('Result:  ') + result );
}


/**
 *  Display Player separator
 *
 *  @param  String  player
 */
function displayPlayerHeader(player) {
    console.log( chalk.bold.green( '===== ' + player + '\'s turn =====' ) );
}


/**
 *  Show Winner's Message
 */
function win() {
    console.log( chalk.bold.green( [
        '',
        '!!!!!!!!!!!!!!!!!!!!!!!',
        '!!!!! W I N N E R !!!!!',
        '!!!!!!!!!!!!!!!!!!!!!!!',
        ''
    ].join('\n')) );
}


/**
 *  Game Over message
 */
function gameOver() {
    console.log( chalk.bold.red( [
        '',
        '***********************',
        '#@!#@! GAME OVER #@!#@!',
        '***********************',
        ''
    ].join('\n')) );
}


module.exports = Game;
