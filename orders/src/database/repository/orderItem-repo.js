const { APIError, STATUS_CODES } = require("../../utils/errors/app-errors");
const { OrderItems } = require("../models");

class OrderItemsRepository {
  constructor() {
    this.OrderItems = new OrderItems().schema;
  }

  // Find All Order by filter

  async GetMany(filters) {
    try {
      const orderItemsList = await this.OrderItems.findAll({ where: filters });
      return orderItemsList;
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
      const order = await this.OrderItems.findOne({ where: filters });
      return order.dataValues;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching the order ${e}`,
      );
    }
  }

  // Create an bulk orderItems from order

  async Create(dataArray) {
    try {
      const createdOrderItems = await this.OrderItems.bulkCreate(dataArray);
      return createdOrderItems;
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
      const [updatedCount, updatedOrder] = await this.OrderItems.update(
        updateDetails,
        {
          where: { orderItemID: id },
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
      const deleteOrderCount = await this.OrderItems.destroy({
        where: filters,
      });
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

module.exports = OrderItemsRepository;
