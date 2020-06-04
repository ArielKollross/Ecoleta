import React, { useEffect, useState, ChangeEvent, FormEvent} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

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

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

    const [formData, setFomrData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);

    const history = useHistory();

    useEffect( () => {
        navigator.geolocation.getCurrentPosition( position => {
            const {latitude, longitude} = position.coords;

        setInitialPosition([latitude, longitude])
        })
    }, []);

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

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;

        setFomrData({...formData, [name]: value});
    }

    function handleSelectItem (id: number){

        const alreadySelected = selectedItems.findIndex(item => item == id);

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id); 

            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const {name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city =selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        await api.post('points', data);

        alert('Ponto de coleta criado!')

        history.push('/');
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

            <form onSubmit={handleSubmit}>
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
                        onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                    <div className="field">
                        <label htmlFor="name">Email</label>
                        <input 
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="name">Whatsapp</label>
                        <input 
                        type="text"
                        name="whatsapp"
                        id="whatsapp"
                        onChange={handleInputChange}
                        />
                    </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    {/* [-27.209205, -49.6401092] */}
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
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
                        <li 
                        key={item.id}
                        onClick={() => handleSelectItem(item.id)} 
                        className={selectedItems.includes(item.id) ? 'selected' : ''}
                        >
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