import { prisma } from "config/client";
import e from "express";

const getProducts = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
    skip: skip,
    take: pageSize,
  });
  return products;
};

const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id: id },
  });
  return product;
};
const countTotalProductClientPages = async (pageSize: number) => {
  const totalItems = await prisma.product.count();
  const totalPages = Math.ceil(totalItems / pageSize);
  return totalPages
}
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
  }[], cartId: string
) => {
  let quantity = 0;
  for (let i = 0; i < data.length; i++) {
    quantity += +data[i].quantity;
    await prisma.cartDetail.update({
      where: { id: +data[i].id },
      data: { quantity: +data[i].quantity },
    });
  }
  //cập nhập lại sum cart
  await prisma.cart.update({
    where: { id: +cartId },
    data: {
      sum: quantity,
    },
  })

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
  const currentCartDetail = await prisma.cartDetail.findUnique({
    where: { id: cartDetailId },
  });
  const quantity = currentCartDetail.quantity;
  await prisma.cartDetail.delete({
    where: { id: cartDetailId },
  });
  //cập nhập lại sum cart
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
          decrement: quantity,
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
  //tao transaction
  try {
    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { cartDetails: true },
      });
      if (cart) {
        //create order
        const dataOrderDetails =
          cart?.cartDetails?.map((item) => ({
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
          })) ?? [];
        await tx.order.create({
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
        await tx.cartDetail.deleteMany({
          where: { cartId: cart.id },
        });
        await tx.cart.delete({
          where: { id: cart.id },
        });
        //check product
        for (let i = 0; i < cart.cartDetails.length; i++) {
          const productId = cart.cartDetails[i].productId;
          const product = await tx.product.findUnique({
            where: { id: productId },
          });
          if (!product || product.quantity < cart.cartDetails[i].quantity) {
            throw new Error(`Sản phẩm ${product.name} không đủ số lượng`);
          }
          await tx.product.update({
            where: { id: productId },
            data: {
              quantity: {
                decrement: cart.cartDetails[i].quantity,
              },
              sold: {
                increment: cart.cartDetails[i].quantity,
              },
            },
          });
        }
      }
    });
    return "";
  } catch (error) {
    return error.message;
  }

};
const getOrderHistory = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: { orderDetails: { include: { product: true } } },
  });
};
const postAddToCartFromDetailPage = async (req: e.Request, res: e.Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  if (user) {
    await addProductToCart(+quantity, +id, user);
    return res.redirect(`/product/${id}`);
  }
}
export {
  getProducts,
  getProductById,
  addProductToCart,
  updateCartDetailBeforeCheckout,
  getProductInCart,
  deleteProductToCart,
  getUserSumCart,
  handlePlaceOrder,
  getOrderHistory, postAddToCartFromDetailPage
  , countTotalProductClientPages
};
