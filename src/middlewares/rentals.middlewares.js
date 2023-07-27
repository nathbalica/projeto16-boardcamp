import { db } from "../database/database.connection.js";

export async function validateCreateRental(req, res, next) {
    const { customerId, gameId } = req.body;

    try {

        const queryGame = 'SELECT COUNT(*), "stockTotal", "pricePerDay" FROM games WHERE id = $1 GROUP BY "stockTotal", "pricePerDay"';
        const resultGame = await db.query(queryGame, [gameId]);

        if (resultGame.rows[0].qtd === 0) {
            return res.status(400).send('Jogo não encontrado.');
        }

        const { stockTotal, pricePerDay } = resultGame.rows[0];


        const queryCustomer = 'SELECT COUNT(*) FROM customers WHERE id = $1';
        const resultCustomer = await db.query(queryCustomer, [customerId]);

        if (resultCustomer.rows[0].count === 0) {
            return res.status(400).send('Cliente não encontrado.');
        }

        const queryRentedGames = 'SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL';
        const resultRentedGames = await db.query(queryRentedGames, [gameId]);
        const rentedGames = resultRentedGames.rows[0].count;

        // const gameStock = resultGame.rows[0].stockTotal;

        if (rentedGames >= stockTotal) {
            return res.status(400).send('Não há jogos disponíveis para alugar no momento.');
        }

        res.locals.pricePerDay = resultGame.rows[0].pricePerDay

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

