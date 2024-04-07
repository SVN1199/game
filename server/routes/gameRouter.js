const { playerName, getCurrentGameId, startGame, getRounds, gameResult } = require('../controller.js/gameController')

const router = require('express').Router()

router.post('/', playerName)
router.get('/getId', getCurrentGameId)
router.post('/playgame/:id', startGame)
router.get('/getRounds/:id', getRounds)
router.get('/getWinner/:id', gameResult)

module.exports = router