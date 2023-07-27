import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRental(req, res) {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
    const offset = req.query.offset;
    const limit = req.query.limit;
    const order = req.query.order;
    const desc = req.query.desc;

    try {
        let query = `
            SELECT rentals.*, 
                TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') as "formattedRentDate",
                TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') as "formattedReturnDate",
                games.name AS "gameName",
                customers.name AS "customerName"
            FROM rentals
            JOIN games ON rentals."gameId" = games.id 
            JOIN customers ON rentals."customerId" = customers.id
        `;

        let queryParams = [];

        if (customerId) {
            query += ` WHERE customers.id = $${queryParams.length + 1}`;
            queryParams.push(customerId);
        }

        if (gameId) {
            if (queryParams.length > 0) {
                query += ` AND games.id = $${queryParams.length + 1}`;
            } else {
                query += ` WHERE games.id = $${queryParams.length + 1}`;
            }
            queryParams.push(gameId);
        }

        if (offset) {
            query += ` OFFSET $${queryParams.length + 1}`;
            queryParams.push(offset);
        }

        if (limit) {
            query += ` LIMIT $${queryParams.length + 1}`;
            queryParams.push(limit);
        }

        if (order) {
            const orderBy = desc === 'true' ? 'DESC' : 'ASC';
            query += ` ORDER BY ${order} ${orderBy}`;
        }

        const rentals = await db.query(query, queryParams);

        const formattedRentals = rentals.rows.map((rental) => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.formattedRentDate,
            daysRented: rental.daysRented,
            returnDate: rental.formattedReturnDate,
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
        res.status(500).send(err.message);
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

export async function returnRental(req, res) {
    const { id } = req.params;
    const delayFee = res.locals.delayFee;


    try {
        await db.query(`
        UPDATE rentals
        SET "returnDate" = Now(), "delayFee" = $1
        WHERE id = $2;
      `, [delayFee, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    if (!id) return sendStatus(404);

    try {
        await db.query(`DELETE FROM rentals WHERE id = $1`, [id])
        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message);
    }
}