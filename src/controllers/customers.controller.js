import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
    const cpf = req.query.cpf;
    const offset = req.query.offset;
    const limit = req.query.limit;

    try {

        let customer;
        let queryParams = [];
        let queryString = 'SELECT * FROM customers';

        if (cpf) {
            queryParams.push(`${cpf}%`);
            queryString += ' WHERE cpf ILIKE $' + queryParams.length;
        }

        if (offset) {
            queryParams.push(offset);
            queryString += ' OFFSET $' + queryParams.length;
        }

        if (limit) {
            queryParams.push(limit);
            queryString += ' LIMIT $' + queryParams.length;
        }

        customer = await db.query(queryString, [...queryParams]);

        res.send(customer.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomersById(req, res) {
    const { id } = req.params;
    try {
        const queryCustomer = `SELECT * FROM customers WHERE id = $1`
        const customers = await db.query(queryCustomer, [id])
        const customer = customers.rows[0];

        if (!customer) {
            return res.status(404).send('Cliente não encontrado.');
        }

        res.send(customer);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function createCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body

    try {
        await db.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]
        )

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body
    const { id } = req.params;
    if (!id) return sendStatus(404);

    try {
        await db.query(
            `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;`,
            [name, phone, cpf, birthday, id]
        )

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message);
    }

}

// export async function deleteCustomers(req, res){
//     const { id } = req.params;
//     if (!id) return sendStatus(404);

//     try{
//         await db.query(`DELETE FROM customers WHERE id = $1`, [id])
//     }catch (err){
//         res.status(500).send(err.message);
//     }
// }


