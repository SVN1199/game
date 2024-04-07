import axios from 'axios'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../AppContext'

const Main = () => {
    const [player1, setPlayer1] = useState('Player 1')
    const [player2, setPlayer2] = useState('Player 2')
    const [openGO, setOpenGo] = useState(false)
    const [getGameId, setGetGameId] = useState('')
    const { API_URL } = useContext(AppContext)
    const [loading, setLoading] = useState(false)

    const submitName = async (formData) => {
        try {
            const configData = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const apiUrl = API_URL;
            await axios.post(apiUrl, formData, configData);
            setOpenGo(true)
        } catch (error) {
            console.error('Error submitting names:', error);
        }
    };


    const getId = async () => {
        try {
            const response = await axios.get(`${API_URL}/getId`)
            const data = await response.data.gameId
            setGetGameId(data)
        } catch (error) {
            console.error('Error :', error);
        }
    }

    const onsubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();
        formData.append('player1', player1)
        formData.append('player2', player2)
        await submitName(formData);
        getId()
        setLoading(false)
    }

    return (
        <div>
            <div className='main'>
                <div className="game-name">
                    Elemental Clash
                </div>
                <form onSubmit={onsubmit}>
                    <div className="main-card">
                        <div>
                            <input
                                type="text"
                                placeholder='Player1'
                                name='player1'
                                value={player1}
                                onChange={(e) => setPlayer1(e.target.value)}
                            />
                        </div>
                        <div className='versus'>
                            VS
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder='Player2'
                                name='player2'
                                value={player2}
                                onChange={(e) => setPlayer2(e.target.value)}
                            />
                        </div>
                    </div>
                    <button disabled={loading}>Start Game</button>
                </form>
                {
                    openGO &&
                    <Link to={`/game/${getGameId}`}>
                        <div className="go-game">
                            Go
                        </div>
                    </Link>
                }

            </div>
            <div className="by-author">
                The Game Designed By Vasanth S
            </div>
        </div>

    )
}

export default Main