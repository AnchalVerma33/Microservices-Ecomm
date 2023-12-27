const { APIError, STATUS_CODES } = require("../../utils/errors/app-errors");
const { Order } = require("../models");

class OrderRepository {
  constructor() {
    this.Order = new Order().schema;
  }

  // Find All Order by filter

  async GetMany(filters) {
    try {
      const orderList = await this.Order.findAll({ where: filters });
      return orderList;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching order list ${e}`,
      );
    }
  }

  // Find One Order By filters

  async GetOne(filters) {
    try {
      const order = await this.Order.findOne({ where: filters });
      if (!order) {
        return null;
      }
      return order.dataValues;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching the order ${e}`,
      );
    }
  }

  // Create an order

  async Create(data) {
    try {
      const order = await this.Order.create(data);
      return order;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while creating the order ${e}`,
      );
    }
  }

  // Update order

  async Update(id, updateDetails, returnUpdatedDetails = true) {
    try {
      const [updatedCount, updatedOrder] = await this.Order.update(
        updateDetails,
        {
          where: { orderID: id },
          returning: returnUpdatedDetails,
        },
      );
      const order = updatedOrder[0].dataValues;
      return order;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while updating the order details ${e}`,
      );
    }
  }

  // Delete order

  async Delete(filters) {
    try {
      const deleteOrderCount = await this.Order.destroy({ where: filters });
      return deleteOrderCount;
    } catch (e) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while deleting the order ${e}`,
      );
    }
  }
}

module.exports = OrderRepository;
