import { Request, Response } from "express";
import { countTotalProductClientPages, getProducts } from "services/client/item.services";
import {
  getAllRole,
  handleCreateUser,
  handleDeleteUser,
  handleUpdateUser,
  handleViewUser,
} from "services/user.service";
const getHomePage = async (req: Request, res: Response) => {

  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;
  const totalPages = await countTotalProductClientPages(8)
  const products = await getProducts(currentPage, 8);
  return res.render("client/home/show.ejs", { products, totalPages: +totalPages, page: +currentPage });
};
const getProductFilterPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;
  const totalPages = await countTotalProductClientPages(6);
  const products = await getProducts(currentPage, 6);
  return res.render("client/product/filter.ejs", { products, totalPages: +totalPages, page: +currentPage });
}
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
  getProductFilterPage
};
