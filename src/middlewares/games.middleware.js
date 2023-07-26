import { db } from "../database/database.connection.js";

export async function validateCreateGame(req, res, next) {
    const { name } = req.body;
  
    try {
      // Verificação se o nome do jogo já existe no banco de dados
      const query = 'SELECT COUNT(*) as qtd FROM games WHERE name = $1';
      const result = await db.query(query, [name]);
  
      if (result.rows[0].qtd > 0) {
        return res.status(409).send('O jogo com este nome já existe no banco de dados.');
      }
  
      next();
    } catch (error) {
      res.status(500).send(error.message);
    }
}