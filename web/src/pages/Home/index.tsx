import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom'

import './Home.css'
import logo from '../../assets/logo.svg';

const Home = () => {
    return(
        <div id="page-home">
            <div className="content">
                <header>
                <img src={logo} alt="ecoleta"/>
                </header>

                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente.</p>

                    <Link to="/cadastro">
                        <span>
                           <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default Home;