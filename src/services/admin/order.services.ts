import { Prisma } from "@prisma/client";
import { prisma } from "config/client";
import { TOTAL_ITEM_PER_PAGE } from "config/constant";
const getOrderAdmin = async (page: number) => {
  const pageSize = TOTAL_ITEM_PER_PAGE;
  const skip = (page - 1) * pageSize;
  const orders = await prisma.order.findMany({
    include: { user: true },
    skip: skip,
    take: pageSize,
  });
  return orders;
};
const countTotalOrderPages = async () => {
  const pageSize = TOTAL_ITEM_PER_PAGE;
  const totalItems = await prisma.order.count();

  const totalPages = Math.ceil(totalItems / pageSize);
  return totalPages;
}
const getOrderDetailAdmin = async (orderId: number) => {
  return await prisma.orderDetail.findMany({
    where: { orderId },
    include: { product: true },
  });
};
export { getOrderAdmin, getOrderDetailAdmin, countTotalOrderPages };
