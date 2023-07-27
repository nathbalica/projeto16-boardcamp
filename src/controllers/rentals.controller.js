import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRental(req, res) {
    try {
        const rentals = await db.query(`
            select rentals.*, games.name as "gameName", customers.name as "customerName"
            from rentals
            join games on rentals."gameId"=games.id 
            join customers on rentals."customerId"=customers.id;`
        )

        const formattedRentals = rentals.rows.map((rental) => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customerId,
                name: rental.customerName,
            },
            game: {
                id: rental.gameId,
                name: rental.gameName,
            },
        }));

        res.send(formattedRentals);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body
    const pricePerDay = res.locals.pricePerDay

    if (pricePerDay === undefined) {
        return res.status(400).send('Preço por dia do jogo não encontrado.');
    }

    const rentDate = dayjs().format('YYYY-MM-DD');
    const originalPrice = pricePerDay * daysRented;

    console.log(pricePerDay)
    try {

        await db.query(`
            INSERT INTO rentals 
            ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, null, null);`,
            [customerId, gameId, daysRented, rentDate, originalPrice]
        )
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}