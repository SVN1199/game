import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import AppContext from '../AppContext';
import Home from './Home';
import Loader from './Loader';

const Result = () => {
  const { API_URL } = useContext(AppContext);
  const { id } = useParams()
  const [getRounds, setGetRounds] = useState([])
  const [getWinner, setGetWinner] = useState('')
  const [getNames, setGetNames] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getResult = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/getWinner/${id}`)
        const rounds = await response.data.rounds
        const winner = await response.data.winner
        const names = await response.data.names
        setGetRounds(rounds)
        setGetWinner(winner)
        setGetNames(names)
        setLoading(false)
      } catch (error) {
        if (error.response) {
          console.log('Server error:', error.response.data);
        } else if (error.request) {
          console.log('Network error:', error.request);
        } else {
          console.log('Error:', error.message);
        }
      }
    }
    getResult()
  }, [API_URL, id])

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  return (
    <>
      <Home />
      <div className='note' onClick={handleOpenModal}>Note</div>
      {
        loading ? <Loader /> :
          <div className="result-container">
            <div className="game-result-heading">
              {getWinner === 'Tie' ? <span>The Match is <span style={{ color: 'red', marginLeft: '5px' }}>Tie</span></span> :
                <span>Winner of the Match - <span style={{ color: 'red' }}>{getWinner}</span></span>
              }
            </div>
            <div className="result-box">
              <div className="winner-game">
                Results for Each Round
              </div>

              {getRounds.map(round => (
                <div className="rounds-box" key={round._id}>
                  <div className="rounds">
                    <div className="players-choice">
                      <b>{getNames.p1}</b>
                      <span className='result'>
                        {round.player1Choice}
                      </span>
                    </div>
                    <div className="players-choice">
                      <b>{getNames.p2}</b>
                      <span className='result'>
                        {round.player2Choice}
                      </span>
                    </div>
                    <div className="players-choice">
                      <b>Round</b>
                      <span className='result'>
                        {round.roundNumber}
                      </span>
                    </div>
                    <div className="players-choice">
                      <b>Winner</b>
                      <span className='result'>
                        {round.winner}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      }
      {
        openModal &&
        <div className="modal-box">
          <p>Your game history will be deleted after 48 hours.</p>
          <button onClick={() => setOpenModal(false)}>Ok</button>
        </div>
      }
    </>
  )
}

export default Result