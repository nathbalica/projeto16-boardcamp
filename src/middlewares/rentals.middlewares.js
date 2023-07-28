import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

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


export async function validateReturnRental(req, res, next) {
    const { id } = req.params;

    try {
        const rentalQuery = 'SELECT * FROM rentals WHERE id = $1 AND "returnDate" IS NULL';
        const rentalResult = await db.query(rentalQuery, [id]);
        const rental = rentalResult.rows[0];

        // if (!rental) {
        //     return res.status(404).send('Aluguel não encontrado.');
        // }

        if (rental.returnDate) {
            return res.status(400).send('O aluguel já foi retornado.');
        }
        const returnDate = dayjs();
        const rentDate = dayjs(rental.rentDate);
        const daysRented = rental.daysRented;
        const pricePerDay = rental.originalPrice / daysRented;
        const daysDelayed = Math.max(0, returnDate.diff(rentDate, 'day') - daysRented);

        console.log(daysDelayed, pricePerDay)

        const delayFee = daysDelayed * pricePerDay;

        // res.locals.rental = rental;
        res.locals.delayFee = delayFee;

        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function validateDeleteRental(req, res, next) {
    const { id } = req.params;

    const rentalQuery = 'SELECT * FROM rentals WHERE id = $1';
    const rentalResult = await db.query(rentalQuery, [id]);

    if (rentalResult.rowCount === 0) {
        return res.status(404).send({ message: "Aluguel não encontrado!" });
    }

    if (rentalResult.rows[0].returnDate === null) {
        return res.status(400).send({ message: "Aluguel não está finalizado, não é possível deletar." });
    }
    next()
 
}


