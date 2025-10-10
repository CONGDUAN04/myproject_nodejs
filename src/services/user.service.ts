import { prisma } from "config/client";
import { ACCOUNT_TYPE, TOTAL_ITEM_PER_PAGE } from "config/constant";
import bcrypt from "bcrypt";
const saltRounds = 10;
const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, saltRounds);
};
const comparePassword = async (plainText: string, hashPassword: string) => {
  return await bcrypt.compare(plainText, hashPassword);
}
const handleCreateUser = async (
  fullName: string,
  email: string,
  address: string,
  phone: string,
  avatar: string | null,
  role: string
) => {
  const defaultPassword = await hashPassword("123456");
  const user = await prisma.user.create({
    data: {
      fullName,
      username: email,
      address,
      password: defaultPassword,
      accountType: ACCOUNT_TYPE.SYSTEM,
      phone,
      avatar,
      roleId: +role,
    },
  });
  return user;
};
const getAllUser = async (page: number) => {
  const pageSize = TOTAL_ITEM_PER_PAGE;
  const skip = (page - 1) * pageSize;
  const users = await prisma.user.findMany({
    skip: skip,
    take: pageSize,
  });
  return users;
};
const countTotalUserPages = async () => {
  const pageSize = TOTAL_ITEM_PER_PAGE;
  const totalItems = await prisma.user.count();

  const totalPages = Math.ceil(totalItems / pageSize);
  return totalPages;
}
const getUserById = async (id: string) => {
  const users = await prisma.user.findUnique({ where: { id: +id } });
  return users;
};

const getAllRole = async () => {
  const roles = await prisma.role.findMany();
  return roles;
};
const handleDeleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id: +id },
  });
  return user;
};
const handleViewUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: +id } });
  return user;
};
const handleUpdateUser = async (
  id: string,
  fullName: string,
  address: string,
  phone: string,
  avatar: string,
  role: string
) => {
  const updatedUser = await prisma.user.update({
    where: { id: +id },
    data: {
      fullName: fullName,
      address: address,
      phone: phone,
      ...(avatar !== undefined && { avatar: avatar }),
      roleId: +role,
    },
  });
  return updatedUser;
};
export {
  handleCreateUser,
  getAllUser,
  handleDeleteUser,
  handleViewUser,
  handleUpdateUser,
  getAllRole,
  hashPassword,
  comparePassword,
  getUserById, countTotalUserPages
};
