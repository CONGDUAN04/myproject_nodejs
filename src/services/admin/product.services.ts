import { prisma } from "config/client";

const createProduct = async (
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  imageUpload: string
) => {
  return prisma.product.create({
    data: {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      ...(imageUpload && { image: imageUpload }),
    },
  });
};

const getProductList = async () => {
  return await prisma.product.findMany();
};
const handleDeleteProduct = async (id: string) => {
  const product = await prisma.product.delete({
    where: { id: +id },
  });
  return product;
};
const handleViewProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id: +id } });
  return product;
};
const handleUpdateProduct = async (
  id: string,
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  image: string
) => {
  const updatedProduct = await prisma.product.update({
    where: { id: +id },
    data: {
      name: name,
      price: +price,
      detailDesc: detailDesc,
      shortDesc: shortDesc,
      quantity: +quantity,
      factory: factory,
      target: target,
      image: image,
      ...(image !== undefined && { image: image }),
    },
  });
  return updatedProduct;
};

export {
  createProduct,
  getProductList,
  handleDeleteProduct,
  handleViewProduct,
  handleUpdateProduct,
};
