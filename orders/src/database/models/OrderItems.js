const { DataTypes } = require("sequelize");
const { DB } = require("../connect");

class OrderItemsModel {
  constructor() {
    this.db = DB.connection;
    this.schema = this.db.define(
      "OrderItems",
      {
        orderItemID: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        orderID: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: "Orders",
            key: "orderID",
          },
        },
        productID: {
          type: DataTypes.STRING,
          references: {
            model: "Products",
            key: "productID",
          },
        },
        quantity: {
          type: DataTypes.INTEGER,
        },
        itemPrice: {
          type: DataTypes.DECIMAL(10, 2),
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: this.db.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: this.db.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        hooks: {
          beforeUpdate: (instance) => {
            instance.updatedAt = new Date();
          },
        },
      },
    );
  }
}

module.exports = OrderItemsModel;
