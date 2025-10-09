import { Request, Response } from "express";
import {
  addProductToCart,
  deleteProductToCart,
  getOrderHistory,
  getProductById,
  getProductInCart,
  handlePlaceOrder,
  updateCartDetailBeforeCheckout,
} from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(+id);
  return res.render("client/product/detail.ejs", { product });
};
const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (user) {
    await addProductToCart(1, +id, user);
  } else {
    return res.redirect("/login");
  }
  return res.redirect("/");
};
const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const cartDetails = await getProductInCart(+user.id);

  const totalPrice = cartDetails
    ?.map((item) => item.price * +item.quantity)
    ?.reduce((a, b) => a + b, 0);
  const cartId = cartDetails.length ? cartDetails[0].cartId : 0

  return res.render("client/product/cart", { cartDetails, totalPrice, cartId });
};
const postDeleteProductInCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (user) {
    await deleteProductToCart(+id, user.id, user.sumCart);
  } else {
    return res.redirect("/login");
  }
  return res.redirect("/cart");
};
const getCheckoutPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const cartDetails = await getProductInCart(+user.id);

  const totalPrice = cartDetails
    ?.map((item) => item.price * +item.quantity)
    ?.reduce((a, b) => a + b, 0);

  return res.render("client/product/checkout", { cartDetails, totalPrice });
};
const postHandleCartToCheckout = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  const { cartId } = req.body;
  const currentCartDetails: { id: string; quantity: string }[] =
    req.body?.cartDetails ?? [];
  await updateCartDetailBeforeCheckout(currentCartDetails, cartId);
  return res.redirect("/checkout");
};
const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body;
  const message = await handlePlaceOrder(
    user.id,
    receiverName,
    receiverAddress,
    receiverPhone,
    +totalPrice
  );
  if (message) {
    return res.redirect("/checkout")
  }
  return res.redirect("/thanks");

};
const getThanksPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  //logic place order
  return res.render("client/product/thanks.ejs");
};
const getOrderHistoryPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const orders = await getOrderHistory(user.id);
  return res.render("client/product/order-history.ejs", { orders });
}
export {
  getProductPage,
  postAddProductToCart,
  getCartPage,
  postDeleteProductInCart,
  getCheckoutPage,
  postHandleCartToCheckout,
  postPlaceOrder,
  getThanksPage,
  getOrderHistoryPage
};
