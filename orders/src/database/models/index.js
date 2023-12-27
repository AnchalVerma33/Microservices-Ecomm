const User = require("./User");
const Cart = require("./Cart");
const Order = require("./Order");
const OrderItems = require("./OrderItems");
const Product = require("./Product");

class Models {
  constructor(db) {
    this.db = db;
    (this.user = new User()),
      (this.product = new Product()),
      (this.order = new Order()),
      (this.orderItems = new OrderItems());
  }

  async migrate(force) {
    try {
      await this.db.sync({ force });
      console.log("Migration done successfully");
    } catch (e) {
      console.error(`Error while making migrations: ${e}`);
    }
  }
}

module.exports = {
  Models,
  User,
  Cart,
  Order,
  OrderItems,
  Product,
};
