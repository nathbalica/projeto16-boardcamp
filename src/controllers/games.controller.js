import { db } from "../database/database.connection.js";

export async function getGames(req, res){
    const name = req.query.name;
    const offset = req.query.offset;
    const limit = req.query.limit;
    try{
        let games;
        let queryParams = [];
        let queryString = 'SELECT * FROM games';

        if (name) {
            queryParams.push(`${name}%`);
            queryString += ' WHERE name ILIKE $' + queryParams.length;
        }

        if (offset) {
            queryParams.push(offset);
            queryString += ' OFFSET $' + queryParams.length;
        }

        if (limit) {
            queryParams.push(limit);
            queryString += ' LIMIT $' + queryParams.length;
        }

        games = await db.query(queryString, [...queryParams]);
        res.status(200).send(games.rows);
    } catch(err) {
        res.status(500).send(err.message);
    }
}

export async function createGame(req, res){
    const { name, image, stockTotal, pricePerDay } = req.body

    try{
        await db.query(
            `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, 
            [name, image, stockTotal, pricePerDay]
        )
        res.sendStatus(201)
    }catch(err){
        res.status(500).send(err.message)
    }
}