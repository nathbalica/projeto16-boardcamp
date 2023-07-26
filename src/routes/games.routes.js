import { Router } from "express"
import { getGames, createGame } from "../controllers/games.controller.js"
import { gamesSchema } from "../schemas/games.schemas.js"
import { validateCreateGame } from "../middlewares/games.middleware.js"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"

const gameRouter = Router()

gameRouter.get("/games", getGames)
gameRouter.post("/games", validateSchema(gamesSchema), validateCreateGame, createGame)

export default gameRouter
