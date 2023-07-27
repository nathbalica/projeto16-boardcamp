import { db } from "../database/database.connection.js";

export async function getGames(req, res){
    const name = req.query.name;
    try{
        let games;
        if (name) {
            games = await db.query('SELECT * FROM games WHERE name ILIKE $1', [`${name}%`]);
        } else {
            games = await db.query('SELECT * FROM games');
        }
        
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