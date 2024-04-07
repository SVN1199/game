const catchAsyncError = require("../middeware/catchAsyncError");
const Game = require('../models/gameModel');
const ErrorHandler = require("../utils/ErrorHandler");

const playerName = catchAsyncError(async (req, res, next) => {
    const { player1, player2 } = req.body;
    const newPlayers = new Game({ player1, player2 });

    try {
        await newPlayers.save();
        res.status(201).json({ message: 'Game started successfully.' });
    } catch (err) {
        next(err)
    }
})

const getCurrentGameId = catchAsyncError(async (req, res, next) => {
    try {
        const players = await Game.findOne().sort({ createdAt: -1 }).select('_id');
        res.status(200).json({
            success: true,
            gameId: players._id
        });
    } catch (error) {
        next(error)
    }
})

const startGame = catchAsyncError(async (req, res, next) => {
    const { player1Choice, player2Choice } = req.body;

    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId);
        const players = await Game.findById(gameId).select('player1 player2')

        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        const roundNumber = game.rounds.length + 1;

        game.rounds.push({ roundNumber, player1Choice, player2Choice });

        let winner = '';
        if (roundNumber <= 6) {
            if (player1Choice === player2Choice) {
                winner = 'Tie';
            } else if (
                (player1Choice === 'stone' && player2Choice === 'scissors') ||
                (player1Choice === 'scissors' && player2Choice === 'paper') ||
                (player1Choice === 'paper' && player2Choice === 'stone')
            ) {
                winner = players.player1;
            } else {
                winner = players.player2;
            }
        } else {
            console.log('Round Completed');
        }

        game.rounds[roundNumber - 1].winner = winner;

        await game.save();

        res.status(200).json({ message: 'Round played successfully.', winner });
    } catch (err) {
        console.error('Error starting game:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

const getRounds = catchAsyncError(async (req, res, next) => {
    const gameId = req.params.id
    const game = await Game.findById(gameId).select('rounds player1 player2')
    res.status(200).json({
        names: {
            p1: game.player1,
            p2: game.player2,
        },
        rounds: game.rounds
    })
})

const gameResult = catchAsyncError(async (req, res, next) => {
    try {
        const gameId = req.params.id
        const game = await Game.findById(gameId)
        const players = await Game.findById(gameId).select('player1 player2')
        if (!game) {
            return next(new ErrorHandler('Game Not Found', 404))
        }
        if (game.rounds.length === 6) {
            const player1Wins = game.rounds.filter(round => round.winner === players.player1).length;
            const player2Wins = game.rounds.filter(round => round.winner === players.player2).length;
            if (player1Wins === player2Wins) {
                game.winner = 'Tie';
            } else if (player2Wins > player1Wins) {
                game.winner = players.player2;
            } else {
                game.winner = players.player1;
            }
        }
        await game.save();
        res.status(200).json({
            names: {
                p1: players.player1,
                p2: players.player2
            },
            rounds: game.rounds,
            winner: game.winner
        })
    } catch (error) {
        next(error)
    }
})

const deleteGames = async () => {
    try {
        const timeToDelete = new Date(Date.now() - 48 * 60 * 60 * 1000);
        await Game.deleteMany({ createdAt: { $lt: timeToDelete } });
    } catch (error) {
        console.error('Error deleting old games:', error);
    }
};

setInterval(deleteGames, 24 * 60 * 60 * 1000);

module.exports = {
    playerName,
    startGame,
    gameResult,
    getCurrentGameId,
    getRounds,
    gameResult
}