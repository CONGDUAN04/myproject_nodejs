import { prisma } from "config/client";
import e from "express";

const getProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id: id },
  });
  return product;
};

const addProductToCart = async (
  quantity: number,
  productId: number,
  user: Express.User
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (cart) {
    // update cart
    // cập nhập sum giỏ hàng
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sum: {
          increment: quantity,
        },
      },
    });
    // cập nhập cart detail
    // nếu chưa có, tạo mới; có rồi thì cập nhập số lượng
    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: {
        productId: productId,
        cartId: cart.id,
      },
    });

    await prisma.cartDetail.upsert({
      where: {
        id: currentCartDetail?.id ?? 0,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        price: product.price,
        quantity: quantity,
        productId: productId,
        cartId: cart.id,
      },
    });
  } else {
    // create cart
    await prisma.cart.create({
      data: {
        sum: quantity,
        userId: user.id,
        cartDetails: {
          create: [
            {
              price: product?.price,
              quantity: quantity,
              productId: productId,
            },
          ],
        },
      },
    });
  }
};
const getProductInCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });
  if (cart) {
    const currentCartDetail = await prisma.cartDetail.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });
    return currentCartDetail;
  }
  return [];
};
const updateCartDetailBeforeCheckout = async (
  data: {
    id: string;
    quantity: string;
  }[]
) => {
  for (let i = 0; i < data.length; i++) {
    await prisma.cartDetail.update({
      where: { id: +data[i].id },
      data: { quantity: +data[i].quantity },
    });
  }
};
const getUserSumCart = async (id: string) => {
  const user = await prisma.cart.findUnique({
    where: { userId: +id },
  });

  return user?.sum ?? 0;
};
const deleteProductToCart = async (
  cartDetailId: number,
  userId: number,
  sumCart: number
) => {
  //Xoá cart detail
  await prisma.cartDetail.delete({
    where: { id: cartDetailId },
  });
  if (sumCart === 1) {
    //delete cart
    await prisma.cart.delete({
      where: { userId: userId },
    });
  } else {
    //update sum cart
    await prisma.cart.update({
      where: { userId: userId },
      data: {
        sum: {
          decrement: 1,
        },
      },
    });
  }
};
const handlePlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: number
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { cartDetails: true },
  });
  if (cart) {
    const dataOrderDetails =
      cart?.cartDetails?.map((item) => ({
        price: item.price,
        quantity: item.quantity,
        productId: item.productId,
      })) ?? [];
    await prisma.order.create({
      data: {
        receiverName,
        receiverAddress,
        receiverPhone,
        paymentMethod: "COD",
        paymentStatus: "PAYMENT_UNPAID",
        status: "PENDING",
        totalPrice: totalPrice,
        userId,
        orderDetails: {
          create: dataOrderDetails,
        },
      },
    });
    //xóa cart và cart detail
    await prisma.cartDetail.deleteMany({
      where: { cartId: cart.id },
    });
    await prisma.cart.delete({
      where: { id: cart.id },
    });
  }
};

export {
  getProducts,
  getProductById,
  addProductToCart,
  updateCartDetailBeforeCheckout,
  getProductInCart,
  deleteProductToCart,
  getUserSumCart,
  handlePlaceOrder,
};
