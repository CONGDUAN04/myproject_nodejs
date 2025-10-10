import { Request, Response } from "express";
import { getDashboardInfo } from "services/admin/dashboard.services";
import {
  countTotalOrderPages,
  getOrderAdmin,
  getOrderDetailAdmin,
} from "services/admin/order.services";
import { countTotalProductPages, getProductList } from "services/admin/product.services";
import { countTotalUserPages, getAllUser } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  const info = await getDashboardInfo();

  return res.render("admin/dashboard/show.ejs", { info }
  );
};
const getAdminUserPage = async (req: Request, res: Response) => {
  //get user
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;
  const users = await getAllUser(currentPage);
  const totalPages = await countTotalUserPages();
  return res.render("admin/user/show.ejs", {
    users: users, totalPages: +totalPages, page: +currentPage
  });
};

const getAdminProductPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;
  const products = await getProductList(currentPage);
  const totalPages = await countTotalProductPages();
  return res.render("admin/product/show.ejs", { products, totalPages: +totalPages, page: +currentPage });
};
const getAdminOrderPage = async (req: Request, res: Response) => {
  //get user
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;
  const orders = await getOrderAdmin(currentPage);
  const totalPages = await countTotalOrderPages();
  return res.render("admin/order/show.ejs", { orders, page: +currentPage, totalPages: +totalPages });
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
