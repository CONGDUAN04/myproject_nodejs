import { Request, Response } from "express";
import { getProductList } from "services/admin/product.services";
import { getAllUser } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  //get user
  return res.render("admin/dashboard/show.ejs");
};
const getAdminUserPage = async (req: Request, res: Response) => {
  //get user
  const id = req.params.id; 
  const users = await getAllUser(id);
  return res.render("admin/user/show.ejs", {
    users: users,
  });
};

const getAdminProductPage = async (req: Request, res: Response) => {
  const products = await getProductList();
  return res.render("admin/product/show.ejs", { products });
};
const getAdminOrderPage = async (req: Request, res: Response) => {
  //get user
  return res.render("admin/order/show.ejs");
};
export {
  getDashboardPage,
  getAdminUserPage,
  getAdminOrderPage,
  getAdminProductPage,
};
