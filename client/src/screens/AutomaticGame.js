import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../AppContext';

const AutomaticGame = () => {
    const { API_URL } = useContext(AppContext);
    const { id } = useParams();

    const [player1Choice, setPlayer1Choice] = useState('');
    const [player2Choice, setPlayer2Choice] = useState('');
    const [getRounds, setGetRounds] = useState([]);
    const [getNames, setGetNames] = useState({});
    const [ok1, setOk1] = useState(false);
    const [startLoading1, setStartLoading1] = useState(false);
    const [startLoading2, setStartLoading2] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [loading, setLoading] = useState(false)

    const getRoundsFunction = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/getRounds/${id}`);
            const { rounds, names } = response.data;
            setGetRounds(rounds);
            setGetNames(names);
        } catch (error) {
            console.error('Error fetching rounds:', error);
        }
    }, [API_URL, id]);

    useEffect(() => {
        getRoundsFunction();
    }, [getRoundsFunction]);

    const onSubmit = async () => {
        try {
            if (player1Choice !== '' && player2Choice !== '' && getRounds.length < 6 && !submitDisabled) {
                setSubmitDisabled(true);
                setLoading(true)
                const postData = {
                    player1Choice,
                    player2Choice
                };
                await axios.post(`${API_URL}/playgame/${id}`, postData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                getRoundsFunction();
                setPlayer1Choice('');
                setPlayer2Choice('');
                setLoading(false)
                setOk1(false);
            }
        } catch (error) {
            console.error('Error submitting choices:', error);
        } finally {
            setSubmitDisabled(false);
        }
    };

    const handleRandomPlayer1 = () => {
        if (getRounds.length < 6) {
            setStartLoading1(true);
            setTimeout(() => {
                const choices = ['stone', 'paper', 'scissors'];
                const randomIndex = Math.floor(Math.random() * choices.length);
                setPlayer1Choice(choices[randomIndex]);
                setOk1(true);
                setStartLoading1(false);
            }, 2000);
        }
    };

    const handleRandomPlayer2 = () => {
        if (getRounds.length < 6) {
            setStartLoading2(true);
            setTimeout(() => {
                const choices = ['stone', 'paper', 'scissors'];
                const randomIndex = Math.floor(Math.random() * choices.length);
                setPlayer2Choice(choices[randomIndex]);
                setStartLoading2(false);
            }, 2000);
        }
    };

    return (
        <div className="game">
            <div className="manual-play">
                <div className="box-rounds">
                    Rounds : {getRounds.length} / 6
                </div>
                <div className="user-choice">
                    <div className="players">
                        <div className="player-name">{getNames.p1}</div>
                        <div className={`images-choice`}>
                            <div onClick={handleRandomPlayer1} className={`game-choice ${ok1 ? 'game-choice-disable' : ''}`}>
                                {startLoading1 ? <div className="startloading"></div> : <div >{player1Choice ? 'Ok' : 'START'}</div>}
                            </div>
                        </div>
                    </div>
                    <button onClick={onSubmit} disabled={loading} style={{ background: 'none', border: 'none' }}>
                        <div className="images-choice">
                            {
                                getRounds.length < 6 ?
                                    <div className="images-choice">
                                        <img className="versus-image" src="https://www.creativefabrica.com/wp-content/uploads/2020/08/28/Versus-VS-sports-fight-battle-logo-icon-Graphics-5159150-1.jpg" alt="VS" />
                                    </div>
                                    :
                                    'COMPLETED'
                            }
                        </div>
                    </button>
                    <div className="players">
                        <div className="player-name">{getNames.p2}</div>
                        <div className="images-choice">
                            <div onClick={!ok1 ? undefined : handleRandomPlayer2} className={`game-choice ${!ok1 ? 'game-choice-disable' : ''}`}>
                                {startLoading2 ? <div className="startloading"></div> :
                                    <div>{player2Choice ? 'Ok' : 'START'}</div>}
                            </div>
                        </div>
                    </div>
                </div>
                {
                    loading ? <span className='spinner'></span> :
                        <>
                            <div className="winner-rounds">
                                <span>
                                    Winner : {getRounds.length > 0 ? getRounds[getRounds.length - 1].winner : 'Play'}
                                </span>
                            </div>
                        </>
                }
                {getRounds.length === 6 &&
                    <div className="view-results">
                        <Link to={`/result/${id}`}>
                            View Results
                        </Link>
                    </div>}
            </div>
        </div>
    );
};

export default AutomaticGame;
