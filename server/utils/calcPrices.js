// server/utils/calcPrices.js

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const calcPrices = (orderItems) => {
  // acc = accumulator
  // default value for acc is 0
  const itemsPrice = addDecimals(
    orderItems.reduce(
      (acc, item) => acc + (item.price * 100 * item.qty) / 100,
      0
    )
  );

  // Calculate the shipping price
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);

  // Calculate the tax price
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));

  // Calculate the total price
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
