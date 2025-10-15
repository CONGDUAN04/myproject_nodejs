import { createUsersAPI, deleteUserByIdAPI, getAllUsersAPI, getUserByIdAPI, loginAPI, updateUserByIdAPI } from 'controllers/client/api.controller';
import express, { Express } from 'express';
import { checkValidJWT } from 'src/middleware/jwt.middleware';
const router = express.Router();
const apiRoutes = (app: Express) => {
    router.post("/add-product-to-cart", getAllUsersAPI)
    router.get("/users", checkValidJWT, getAllUsersAPI)
    router.get("/users/:id", getUserByIdAPI)
    router.post("/users", createUsersAPI)
    router.put("/users/:id", updateUserByIdAPI)
    router.delete("/users/:id", deleteUserByIdAPI)

    router.post("/login", loginAPI)

    app.use("/api", router)
}
export default apiRoutes