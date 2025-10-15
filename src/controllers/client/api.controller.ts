import { error } from "console";
import { Request, Response } from "express";
import { handleDeleteUserById, handleGetAllUser, handleGetUserById, handleUpdateUserById, handleUserLogin } from "services/client/api.services";
import { registerNewUser } from "services/client/auth.services";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";
const getAllUsersAPI = async (req: Request, res: Response) => {
    const users = await handleGetAllUser()
    const user = req.user
    console.log("<<<check user", user)

    res.status(200).json({
        data: users
    })
}
const getUserByIdAPI = async (req: Request, res: Response) => {
    const { id } = req.params
    const users = await handleGetUserById(+id)
    res.status(200).json({
        data: users
    })
}
const createUsersAPI = async (req: Request, res: Response) => {
    const { fullName, email, password } =
        req.body as TRegisterSchema;
    const validate = await RegisterSchema.safeParseAsync(req.body);
    if (!validate.success) {
        const errorsZod = validate.error.issues;
        const errors = errorsZod.map((item) => `${item.message}${item.path[0]}`);
        res.status(400).json({
            errors: errors
        })
        return
    }
    await registerNewUser(fullName, email, password);
    res.status(201).json({
        data: "create user succeed"
    })
}
const updateUserByIdAPI = async (req: Request, res: Response) => {
    const { fullName, address, phone } = req.body
    const { id } = req.params
    await handleUpdateUserById(+id, fullName, address, phone);
    res.status(200).json({
        data: "Update user succeed"
    })
}
const deleteUserByIdAPI = async (req: Request, res: Response) => {
    const { id } = req.params
    await handleDeleteUserById(+id);
    res.status(200).json({
        data: "Delete user succeed"
    })
}
const loginAPI = async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
        const access_token = await handleUserLogin(username, password)
        res.status(200).json({
            data: {
                access_token
            }
        })
    } catch (error) {
        res.status(401).json({
            data: null,
            message: error.message
        })
    }

}

export {
    getAllUsersAPI,
    getUserByIdAPI,
    createUsersAPI,
    updateUserByIdAPI,
    deleteUserByIdAPI,
    loginAPI
}
