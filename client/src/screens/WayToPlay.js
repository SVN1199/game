import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppContext from '../AppContext';
import axios from 'axios'
import Loader from './Loader';

const WayToPlay = () => {

    const { API_URL } = useContext(AppContext);
    const [getRounds, setGetRounds] = useState([])
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getResult = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${API_URL}/getWinner/${id}`)
                const rounds = await response.data.rounds
                setGetRounds(rounds)
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

    const handleModeChange = (value) => {
        if (value === 'manual') {
            navigate(`/game/manual/${id}`)
        } else {
            navigate(`/game/automatic/${id}`)
        }
    }

    return (
        <div>
            {
                loading ? <Loader />
                    :
                    <div className='way-to-play' >
                        {
                            getRounds.length === 0 ?
                                <div>
                                    <div className="heading">Way To Play</div>
                                    <div className="game_play_mode">
                                        <div className="inside_play_mode" onClick={() => handleModeChange('manual')}>
                                            Manual
                                        </div>
                                        <div className="inside_play_mode" onClick={() => handleModeChange('automatic')}>
                                            Automatic
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='game-live' onClick={() => window.history.forward()}>
                                    The game is still live
                                </div>
                        }
                    </div>
            }
        </div>
    )
}

export default WayToPlay