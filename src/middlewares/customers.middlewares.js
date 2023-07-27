import { db } from "../database/database.connection.js";

export async function validateCreateCustomers(req, res, next) {
    const { cpf } = req.body;

    try {
        // Verificação se o CPF já existe no banco de dados
        const query = 'SELECT COUNT(*) as qtd FROM customers WHERE cpf = $1';
        const result = await db.query(query, [cpf]);

        if (result.rows[0].qtd > 0) {
            return res.status(409).send('Já existe um cliente com este CPF.');
        }

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export async function validateUpdateCustomers(req, res, next) {
    const { cpf } = req.body;
    const { id } = req.params;
  
    try {
      // Verificação se o CPF já existe no banco de dados, exceto para o próprio usuário
      const query = 'SELECT COUNT(*) as qtd FROM customers WHERE cpf = $1 AND id != $2';
      const result = await db.query(query, [cpf, id]);
  
      if (result.rows[0].qtd > 0) {
        return res.status(409).send('Já existe um cliente com este CPF.');
      }
  
      next();
    } catch (error) {
      res.status(500).send(error.message);
    }
  }