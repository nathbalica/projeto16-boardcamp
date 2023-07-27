import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"
import { rentalsSchema } from "../schemas/rentals.schemas.js"
import { createRental, getRental } from "../controllers/rentals.controller.js"
import { validateCreateRental } from "../middlewares/rentals.middlewares.js"


const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRental)
rentalsRouter.post("/rentals", validateSchema(rentalsSchema), validateCreateRental, createRental)

export default rentalsRouter