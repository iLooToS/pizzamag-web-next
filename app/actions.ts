"use server";

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate } from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { DELIVERY_PRICE, VAT } from "@/shared/constants/checkout-price";
import { createPayment, sendEmail } from "@/shared/lib";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = cookies();
    const cartToken = cookieStore.get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token not found");
    }

    /* Находим корзину по токену */
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty");
    }

    const vatPrice = (userCart.totalAmount * VAT) / 100;
    const totalPrice = userCart.totalAmount + vatPrice + DELIVERY_PRICE;

    /* Создаем заказ */
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: totalPrice,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
      },
    });

    /* Очищаем корзину */
    await prisma.cart.update({
      where: { id: userCart.id },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: userCart.id },
    });

    const paymentData = await createPayment({
      amount: totalPrice,
      description: "Оплата заказа #" + order.id,
      orderId: order.id,
    });

    if (!paymentData.status) {
      throw new Error("Payment failed");
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: paymentData.id,
      },
    });

    const paymentUrl = paymentData.confirmation.confirmation_url;

    await sendEmail(
      data.email,
      "Pizza Mag / Оплатите заказ #" + order.id,
      PayOrderTemplate({
        orderId: order.id,
        totalAmount: totalPrice,
        paymentUrl,
      })
    );

    return paymentUrl;
  } catch (error) {
    console.log("[CREATE_ORDER_POST] Server error", error);
  }
}
