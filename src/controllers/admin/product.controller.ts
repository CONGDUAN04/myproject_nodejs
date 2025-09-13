import { Request, Response } from "express";
import {
  createProduct,
  handleDeleteProduct,
  handleUpdateProduct,
  handleViewProduct,
} from "services/admin/product.services";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";
const getAdminCreateProductPage = async (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    name: "",
    price: "",
    detailDesc: "",
    shortDesc: "",
    quantity: "",
    factory: "",
    target: "",
  };
  return res.render("admin/product/create.ejs", {
    errors,
    oldData,
  });
};
const postAdminCreateProductPage = async (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body as TProductSchema;
  const validate = ProductSchema.safeParse(req.body);
  if (!validate.success) {
    //error
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map((item) => `${item.message}(${item.path[0]})`);
    const oldData = {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
    };
    return res.render("admin/product/create.ejs", { errors, oldData });
  }
  //success, create a new product
  const image = req.file?.filename ?? null;
  await createProduct(
    name,
    +price,
    detailDesc,
    shortDesc,
    +quantity,
    factory,
    target,
    image
  );
  return res.redirect("/admin/product");
};
const postDeleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteProduct(id);
  return res.redirect("/admin/product");
};
const getViewProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await handleViewProduct(id);
  return res.render("admin/product/detail.ejs", {
    id: id,
    product: product,
  });
};
const postUpdateProduct = async (req: Request, res: Response) => {
  const { id, name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body;
  const file = req.file;
  const image = file?.filename ?? undefined;
  await handleUpdateProduct(
    id,
    name,
    price,
    detailDesc,
    shortDesc,
    quantity,
    factory,
    target,
    image
  );
  return res.redirect("/admin/product");
};

export {
  getAdminCreateProductPage,
  postAdminCreateProductPage,
  postDeleteProduct,
  getViewProduct,
  postUpdateProduct,
};
