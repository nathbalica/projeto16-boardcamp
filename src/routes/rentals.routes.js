import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"
import { rentalsSchema } from "../schemas/rentals.schemas.js"
import { createRental, getRental, returnRental, deleteRental } from "../controllers/rentals.controller.js"
import { validateCreateRental, validateReturnRental, validateDeleteRental } from "../middlewares/rentals.middlewares.js"


const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRental)
rentalsRouter.post("/rentals", validateSchema(rentalsSchema), validateCreateRental, createRental)
rentalsRouter.post("/rentals/:id/return", validateReturnRental, returnRental)
rentalsRouter.delete("/rentals/:id", validateDeleteRental, deleteRental)
export default rentalsRouter