import React from 'react'
import { FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className='home'>
            <Link to='/' style={{color : 'indigo'}}>
                <FaHome />
            </Link>
        </div>
    )
}

export default Home