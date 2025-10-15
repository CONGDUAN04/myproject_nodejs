import { prisma } from "config/client"
import jwt from "jsonwebtoken"
import { comparePassword } from "services/user.service"
import "dotenv/config"
import { ACCOUNT_TYPE } from "config/constant"
import { truncate } from "fs"
const handleGetAllUser = async () => {
    return await prisma.user.findMany()
}
const handleGetUserById = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id }
    })
}
const handleUpdateUserById = async (id: number, fullName: string, address: string, phone: string) => {
    return await prisma.user.update({
        where: { id },
        data: {
            fullName, address, phone
        }
    })
}
const handleDeleteUserById = async (id: number) => {
    return await prisma.user.delete({
        where: { id }
    })
}
const handleUserLogin = async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { username: username },
        include: { role: true }
    });
    if (!user) {
        //throw error
        throw new Error(`${username} not found`);
    }
    //compare password
    const isMath = await comparePassword(password, user.password);
    if (!isMath) {
        throw new Error("Invalid password");
    }
    //co user login => dinh nghia access token
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
        roleId: user.roleId,
        accountType: user.accountType,
        avatar: user.avatar
    }
    const secret = process.env.JWT_SECRET;
    const expiresIn: any = process.env.JWT_EXPIRES_IN;
    const access_token = jwt.sign(payload, secret, { expiresIn: expiresIn })
    return access_token
}
export {
    handleGetAllUser,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleUserLogin
}

