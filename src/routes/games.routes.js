import { Router } from "express"
import { getGames, createGame } from "../controllers/games.controller"
import { gamesSchema } from "../schemas/games.schemas"
import { validateCreateGame } from "../middlewares/games.middleware"

const gameRouter = Router()

gameRouter.get("/games", validateCreateGame(gamesSchema), getGames)
gameRouter.post("/games", createGame)
