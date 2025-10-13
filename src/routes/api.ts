import { createUsersAPI, deleteUserByIdAPI, getAllUsersAPI, getUserByIdAPI, updateUserByIdAPI } from 'controllers/client/api.controller';
import express, { Express } from 'express';
const router = express.Router();
const apiRoutes = (app: Express) => {
    router.post("/add-product-to-cart", getAllUsersAPI)
    router.get("/users", getAllUsersAPI)
    router.get("/users/:id", getUserByIdAPI)

    router.post("/users", createUsersAPI)

    router.put("/users/:id", updateUserByIdAPI)

    router.delete("/users/:id", deleteUserByIdAPI)
    app.use("/api", router)
}
export default apiRoutes