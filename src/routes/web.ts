import express, { Express } from "express";
import {
  getCreateUserPage,
  getHomePage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
} from "controllers/user.controller";
import {
  getAdminOrderPage,
  getAdminProductPage,
  getAdminUserPage,
  getDashboardPage,
} from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
import { getProductPage } from "controllers/client/product.controller";
import {
  getAdminCreateProductPage,
  getViewProduct,
  postAdminCreateProductPage,
  postDeleteProduct,
  postUpdateProduct,
} from "controllers/admin/product.controller";
import { getLoginPage, getRegisterPage, postRegister } from "controllers/client/auth.controller";
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();
const webRoutes = (app: Express) => {
  router.get("/", getHomePage);
  router.get("/product/:id", getProductPage);
  router.get("/login", getLoginPage);
  router.get("/register", getRegisterPage);
  router.post("/register",postRegister);
  //admin dashboard router
  router.get("/admin", getDashboardPage);
  // admin manage user router
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    fileUploadMiddleware("avatar"),
    postCreateUser
  );
  router.post("/admin/delete-user/:id", postDeleteUser);
  router.get("/admin/view-user/:id", getViewUser);
  router.post(
    "/admin/update-user",
    fileUploadMiddleware("avatar"),
    postUpdateUser
  );
  // admin manage product router
  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/create-product", getAdminCreateProductPage);
  router.post(
    "/admin/create-product",
    fileUploadMiddleware("avatar", "images/product"),
    postAdminCreateProductPage
  );
  router.post("/admin/delete-product/:id", postDeleteProduct);
  router.get("/admin/view-product/:id", getViewProduct);
  router.post(
    "/admin/update-product",
    fileUploadMiddleware("image", "images/product"),
    postUpdateProduct
  );

  router.get("/admin/order", getAdminOrderPage);
  app.use("/", router);
};
export default webRoutes;
