import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../AppContext';

const Game = () => {
    const { API_URL } = useContext(AppContext);
    const { id } = useParams();

    const [player1Choice, setPlayer1Choice] = useState('');
    const [player2Choice, setPlayer2Choice] = useState('');
    const [getRounds, setGetRounds] = useState([]);
    const [getNames, setGetNames] = useState({});
    const [loading, setLoading] = useState(false)

    const getRoundsFunction = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_URL}/getRounds/${id}`);
            const data = await response.data;
            const rounds = data.rounds;
            const names = data.names;
            setLoading(false)
            setGetRounds(rounds);
            setGetNames(names);
        } catch (error) {
            if (error.response) {
                console.log('Server error:', error.response.data);
            } else if (error.request) {
                console.log('Network error:', error.request);
            } else {
                console.log('Error:', error.message);
            }
        }
    }, [API_URL, id]);

    useEffect(() => {
        getRoundsFunction();
    }, [getRoundsFunction]);

    const onSubmit = async () => {
        try {
            if (player1Choice !== '' && player2Choice !== '' && getRounds.length < 6) {
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
                setPlayer1Choice('')
                setPlayer2Choice('')
                setLoading(false)
            }
        } catch (error) {
            console.error('Error submitting choices:', error);
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
                            <div className="input-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="player1Choice"
                                        value="stone"
                                        checked={player1Choice === 'stone'}
                                        onChange={(e) => setPlayer1Choice(e.target.value)}
                                    />
                                    <img
                                        src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/999f0c82-9af4-4be1-be6c-ef54226734c8/dbi1qoo-744f297c-d3a8-4af9-9153-0297d03309da.png/v1/fill/w_995,h_803,q_75,strp/stone_png13598__1__by_parvezedits-dbi1qoo.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl0sIm9iaiI6W1t7InBhdGgiOiIvZi85OTlmMGM4Mi05YWY0LTRiZTEtYmU2Yy1lZjU0MjI2NzM0YzgvZGJpMXFvby03NDRmMjk3Yy1kM2E4LTRhZjktOTE1My0wMjk3ZDAzMzA5ZGEucG5nIiwid2lkdGgiOiI8PTk5NSIsImhlaWdodCI6Ijw9ODAzIn1dXX0.G2q1THeuxMFzh8DJZ26HZgah7Wdg7fH6M3aKIvHQAKk"
                                        alt="Stone"
                                    />
                                </label>
                            </div>
                            <div className="input-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="player1Choice"
                                        value="paper"
                                        checked={player1Choice === 'paper'}
                                        onChange={(e) => setPlayer1Choice(e.target.value)}
                                    />
                                    <img
                                        src="https://www.clipartbest.com/cliparts/di7/o5B/di7o5Bj5T.jpeg"
                                        alt="Paper"
                                    />
                                </label>
                            </div>
                            <label>
                                <input
                                    type="radio"
                                    name="player1Choice"
                                    value="scissors"
                                    checked={player1Choice === 'scissors'}
                                    onChange={(e) => setPlayer1Choice(e.target.value)}
                                />
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/000/583/346/original/scissors-icon-vector.jpg"
                                    alt="Scissors"
                                />
                            </label>
                        </div>
                    </div>
                    {
                        getRounds.length < 6 ?
                            <button onClick={onSubmit} disabled={loading} style={{ background: 'none', border: 'none' }}>
                                <div className="images-choice" >
                                    <img className="versus-image" src="https://www.creativefabrica.com/wp-content/uploads/2020/08/28/Versus-VS-sports-fight-battle-logo-icon-Graphics-5159150-1.jpg" alt="VS" />
                                </div>
                            </button>
                            :
                            'COMPLETED'
                    }

                    <div className="players">
                        <div className="player-name">{getNames.p2}</div>
                        <div className="images-choice">
                            <label>
                                <input
                                    type="radio"
                                    name="player2Choice"
                                    value="stone"
                                    checked={player2Choice === 'stone'}
                                    onChange={(e) => setPlayer2Choice(e.target.value)}
                                />
                                <img
                                    src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/999f0c82-9af4-4be1-be6c-ef54226734c8/dbi1qoo-744f297c-d3a8-4af9-9153-0297d03309da.png/v1/fill/w_995,h_803,q_75,strp/stone_png13598__1__by_parvezedits-dbi1qoo.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl0sIm9iaiI6W1t7InBhdGgiOiIvZi85OTlmMGM4Mi05YWY0LTRiZTEtYmU2Yy1lZjU0MjI2NzM0YzgvZGJpMXFvby03NDRmMjk3Yy1kM2E4LTRhZjktOTE1My0wMjk3ZDAzMzA5ZGEucG5nIiwid2lkdGgiOiI8PTk5NSIsImhlaWdodCI6Ijw9ODAzIn1dXX0.G2q1THeuxMFzh8DJZ26HZgah7Wdg7fH6M3aKIvHQAKk"
                                    alt="Stone"
                                />
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="player2Choice"
                                    value="paper"
                                    checked={player2Choice === 'paper'}
                                    onChange={(e) => setPlayer2Choice(e.target.value)}
                                />
                                <img
                                    src="https://www.clipartbest.com/cliparts/di7/o5B/di7o5Bj5T.jpeg"
                                    alt="Paper"
                                />
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="player2Choice"
                                    value="scissors"
                                    checked={player2Choice === 'scissors'}
                                    onChange={(e) => setPlayer2Choice(e.target.value)}
                                />
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/000/583/346/original/scissors-icon-vector.jpg"
                                    alt="Scissors"
                                />
                            </label>
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
                {
                    getRounds.length === 6 &&
                    <div className="view-results">
                        <Link to={`/result/${id}`}>
                            View Results
                        </Link>
                    </div>
                }
            </div>
        </div>
    );
};

export default Game;
