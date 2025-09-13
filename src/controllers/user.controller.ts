import { Request, Response } from "express";
import {
  getAllRole,
  handleCreateUser,
  handleDeleteUser,
  handleUpdateUser,
  handleViewUser,
} from "services/user.service";
const getHomePage = async (req: Request, res: Response) => {
  return res.render("client/home/show.ejs");
};
const getCreateUserPage = async (req: Request, res: Response) => {
  const roles = await getAllRole();
  return res.render("admin/user/create.ejs", { roles: roles });
};

const postCreateUser = async (req: Request, res: Response) => {
  const { fullName, username, address, phone, role } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? null;
  await handleCreateUser(fullName, username, address, phone, avatar, role);
  return res.redirect("/admin/user");
};
const postDeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteUser(id);
  return res.redirect("/admin/user");
};
const getViewUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const roles = await getAllRole();
  const user = await handleViewUser(id);
  return res.render("admin/user/detail.ejs", {
    id: id,
    user: user,
    roles: roles,
  });
};
const postUpdateUser = async (req: Request, res: Response) => {
  const { id, fullName, address, phone, role } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? undefined;
  await handleUpdateUser(id, fullName, address, phone, avatar, role);
  return res.redirect("/admin/user");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
};
