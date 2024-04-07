const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
    player1: String,
    player2: String,
    rounds: [{
        roundNumber: Number,
        player1Choice: String,
        player2Choice: String,
        winner: String
    }],
    winner: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Player', gameSchema)