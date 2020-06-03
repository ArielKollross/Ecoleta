import React, { useEffect, useState, ChangeEvent} from 'react';
import { Link } from 'react-router-dom';
import {Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';

import './CreatePoint.css';
import logo from '../../assets/logo.svg';
import { FiArrowDownLeft } from 'react-icons/fi';


//when create array or object, need to informr manually this type.

interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface IGBGE_UfResponse {
    sigla: string;
}

interface IBGE_CityResonse {
    nome: string;
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
        api.get('items').then(res => setItems(res.data))
    } , []);

    useEffect(() => {
        axios.get<IGBGE_UfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(res => {
            const ufInitials = res.data.map( uf => uf.sigla)

            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        //new load the UF always change UF 
        if(selectedUf == '0'){
            return;
        }

        axios.
        get<IBGE_CityResonse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(res => {
            const cityNames = res.data.map( city => city.nome)
    
            setCities(cityNames);
        });
        
    }, [selectedUf])

    function handleSelecttUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelecttCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowDownLeft />
                    Voltar para home
                </Link>
            </header>

            <form action="">
                <h1>Cadastro do<br/> ponto de coleta</h1>


                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                        type="text"
                        name="name"
                        id="name"
                        />
                    </div>

                    <div className="field-group">
                    <div className="field">
                        <label htmlFor="name">Email</label>
                        <input 
                        type="email"
                        name="email"
                        id="email"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="name">Whatsapp</label>
                        <input 
                        type="text"
                        name="Whatsapp"
                        id="Whatsapp"
                        />
                    </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>


                    <Map center={[-27.209205, -49.6401092]} zoom={15}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={[-27.209205, -49.6401092]} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf"
                            id="uf"
                            value={selectedUf}
                            onChange={handleSelecttUf}
                            >
                                <option value="0">Selecione um UF</option>
                                {ufs.map( uf => (
                                <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city"
                             id="city"
                            value={selectedCity}
                            onChange={handleSelecttCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map( city => (
                                <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                        <li key={item.id}>
                            <img src={item.image_url} alt={item.title}/>
                            <span>{item.title}</span>
                        </li>

                        ))}
                    </ul>

                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>

            </form>

        </div>
    );
}

export default CreatePoint;