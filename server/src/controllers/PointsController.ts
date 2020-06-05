import {Request, Response} from 'express';
import knex from '../database/connection';

const  localhost = "192.168.15.13";

class PointsController {

    async index(req : Request, res: Response) {
        const {city, uf , items} = req.query;

       const parsedItems = String(items).split(',')
       .map( item => Number(item.trim()));

       const points = await knex('points')
       .join('point_items', 'points.id', '=', 'point_items.point_id')
       .whereIn('point_items.item_id', parsedItems)
       .where('city', String(city)).where('uf', String(uf)).distinct()
       .select('points.*');


       const serializedPoints = points.map( point => {
        return {
            ...point,
            image_url: `http://${localhost}:3333/uploads/${point.image}`,
        };
    }); 
    return res.json(serializedPoints);

        return res.json(points);
    }

    async show(req : Request, res: Response) {
        const { id } = req.params;
       
        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({msg: 'Point not found'});
        }

        const serializedPoint = {      
                ...point,
                image_url: `http://${localhost}:3333/uploads/${point.image}`,  
        }; 

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title');

        return res.json({point: serializedPoint, items});
    }    

    async create(req : Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
    
        // If de 1st query dont work, de 2nd will be fail to
        const trx = await knex.transaction();

        const point = {
            image: req.file.filename,
             name, // ist the same =>  name:name, can short this commands becouse we
             // using the same name to var and key
             email,
             whatsapp,
             latitude,
             longitude,
             city,
             uf
         }
    
       const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items.split(',')
        .map((item: String) => Number(item.trim()))
        .map((item_id: number) => {
            return{
                item_id,
                point_id,
            };
        });
    
        await trx('point_items').insert(pointItems);

        // to commit yr changes
        await trx.commit();
    
        return res.json({
            id: point_id,
            ...point,
    
        });
    }
}

export default PointsController;