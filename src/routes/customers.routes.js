import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"
import { createCustomers, getCustomers, getCustomersById, updateCustomers } from "../controllers/customers.controller.js"
import { validateCreateCustomers, validateUpdateCustomers } from "../middlewares/customers.middlewares.js"
import { createCustomerSchema } from "../schemas/customers.schemas.js"

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.post("/customers", validateSchema(createCustomerSchema), validateCreateCustomers, createCustomers)
customersRouter.get("/customers/:id", getCustomersById)
customersRouter.put("/customers/:id", validateSchema(createCustomerSchema), validateUpdateCustomers, updateCustomers)

export default customersRouter