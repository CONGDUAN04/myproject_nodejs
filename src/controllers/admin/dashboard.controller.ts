import { Request, Response } from "express";
import {
  getOrderAdmin,
  getOrderDetailAdmin,
} from "services/admin/order.service";
import { getProductList } from "services/admin/product.services";
import { getAllUser } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  //get user
  return res.render("admin/dashboard/show.ejs");
};
const getAdminUserPage = async (req: Request, res: Response) => {
  //get user
  const users = await getAllUser();
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
  const orders = await getOrderAdmin();
  return res.render("admin/order/show.ejs", { orders });
};
const getAdminOrderDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderDetails = await getOrderDetailAdmin(+id);
  return res.render("admin/order/detail.ejs", {
    orderDetails,
    id,
  });
};
export {
  getDashboardPage,
  getAdminUserPage,
  getAdminOrderPage,
  getAdminProductPage,
  getAdminOrderDetailPage,
};
