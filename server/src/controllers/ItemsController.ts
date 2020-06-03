import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(req: Request, res: Response){

        const items = await knex('items').select('*');
        // serialized => transform the information to facilete user life
        const serializedItems = items.map( item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`,
            };
        }); 
        console.log(serializedItems)
        return res.json(serializedItems);
    }
}

export default ItemsController