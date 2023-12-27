const {
  OrderRepository,
  OrderItemsRepository,
  ProductRepository,
} = require("../database/repository");
const { APIError } = require("../utils/errors/app-errors");
const { GenerateUUID } = require("../utils/helpers");
const RazorpayService = require("./razorpay-service");

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderItemRepository = new OrderItemsRepository();
    this.productRepository = new ProductRepository();
    this.razorpay = new RazorpayService();
  }

  async InitiateOrder(data) {
    const currency = "INR";
    try {
      const { user, productData } = data;
      const productArray = productData
        .filter((obj) => {
          if (obj.productID && obj.quantity > 0) {
            return obj;
          }
        })
        .map((obj) => ({
          productID: obj.productID,
          quantity: obj.quantity,
        }));
      const dbProdData = await this.productRepository.ProductList({
        productID: productArray.map((obj) => obj.productID),
      });

      const finalProdData = dbProdData.map((obj) => obj.dataValues);

      let totalprice = 0;
      const remainingQuantity = [];
      const orderItemsList = [];

      for (let i = 0; i < productArray.length; i++) {
        const id = productArray[i].productID;
        if (productArray[i].quantity > finalProdData[i].quantity) {
          return { message: `${finalProdData[i].productName} is out of stock` };
        }

        totalprice += finalProdData[i].price * productArray[i].quantity;
        const noUnitsLeft =
          finalProdData[i].quantity - productArray[i].quantity;
        remainingQuantity.push({ productID: id, quantity: noUnitsLeft });
        orderItemsList.push({
          orderItemID: GenerateUUID(),
          productID: id,
          quantity: productArray[i].quantity,
          itemPrice: finalProdData[i].price * productArray[i].quantity,
        });
      }

      const razorpayOrder = await this.razorpay.CreateRazorpayOrder({
        amount: totalprice * 100,
        currency,
      });

      await this.productRepository.BulkUpdate(remainingQuantity);
      const orderID = razorpayOrder.id;

      const finalOrderItemsList = orderItemsList.map((obj) => ({
        ...obj,
        orderID,
        currency,
      }));

      const finalOrder = await this.orderRepository.Create({
        orderID,
        userID: user.id,
        orderDate: new Date(),
        totalAmount: totalprice,
        orderStatus: "Initiated",
        currency,
      });

      const pushOrderItems =
        await this.orderItemRepository.Create(finalOrderItemsList);
      return finalOrder;
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  async CancelOrder(data) {
    let doRefund = false;
    try {
      const {
        filters: { orderID },
        user: { id },
      } = data;
      const order = await this.orderRepository.GetOne({ orderID, userID: id });
      if (!order) {
        return { message: "Order Not Found" };
      }
      if (["Failed", "Cancelled"].includes(order.orderStatus)) {
        return { message: `Order Status : ${order.orderStatus}` };
      }

      if (["Verified", "Completed"].includes(order.orderStatus)) {
        doRefund = true;
      }
      const orderItems = await this.orderItemRepository.GetMany({ orderID });

      const dbProdData = await this.productRepository.ProductList({
        productID: orderItems.map((obj) => obj.productID),
      });

      const finalProdData = dbProdData.map((obj) => obj.dataValues);

      const productMap = finalProdData.reduce((myMap, obj) => {
        myMap[obj.productID] = obj;
        return myMap;
      }, {});

      const productArray = orderItems.map((obj) => ({
        productID: obj.productID,
        quantity: obj.quantity + productMap[obj.productID].quantity,
      }));

      const updatedProduct =
        await this.productRepository.BulkUpdate(productArray);
      const updatedOrder = await this.orderRepository.Update(orderID, {
        orderStatus: "Cancelled",
      });
      if (doRefund) {
        console.log(
          `Refund initiated for the order amount : ${order.totalAmount}`,
        );
      }
      return updatedOrder;
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  async CompleteOrder(data) {
    try {
      const {
        filters: { orderID },
        user: { id },
        details: { paymentID, transactionHash },
      } = data;
      const order = await this.orderRepository.GetOne({ orderID, userID: id });
      if (!order) {
        return { message: "Order Not Found" };
      }
      if (
        ["Failed", "Cancelled", "Verified", "Completed"].includes(
          order.orderStatus,
        )
      ) {
        return { message: `Order Status : ${order.orderStatus}` };
      }

      const updatedOrder = await this.orderRepository.Update(orderID, {
        orderStatus: "Completed",
        paymentID,
        transactionHash,
      });
      return updatedOrder;
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  async GetAllOrders(filters, infoLevel = "min") {
    try {
      const orders = await this.orderRepository.GetMany(filters);
      if (infoLevel == "max") {
        for (const index in orders) {
          const item = orders[index];
          const orderItems = await this.orderItemRepository.GetMany({
            orderID: item.dataValues.orderID,
          });
          orders[index].dataValues.orderItems = orderItems.map(
            (obj) => obj.dataValues,
          );
        }
      }
      return orders;
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  async GetOneOrder(filters, infoLevel) {
    try {
      const orders = await this.orderRepository.GetOne(filters);
      if (infoLevel == "max") {
        const orderItems = await this.orderItemRepository.GetMany({
          orderID: orders.orderID,
        });
        orders.orderItems = orderItems.map((obj) => obj.dataValues);
      }
      return orders;
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  async VerifyOrder(filters) {
    try {
      const order = await this.orderRepository.GetOne(filters);
      if (!order) {
        return { message: "Order Not Found" };
      }
      const { orderID, paymentID, transactionHash, orderStatus } = order;
      if (
        ["Failed", "Cancelled", "Initiated", "Verified"].includes(orderStatus)
      ) {
        return { message: `Order Status : ${orderStatus}` };
      }
      const verified = this.razorpay.VerifyOrder({
        order_id: orderID,
        razorpay_payment_id: paymentID,
        razorpay_signature: transactionHash,
      });

      if (verified) {
        const updateOrderStatus = await this.orderRepository.Update(orderID, {
          orderStatus: "Verified",
          isTransactionVerified: true,
        });
        return updateOrderStatus;
      }

      return order;
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }
}

module.exports = OrderService;
